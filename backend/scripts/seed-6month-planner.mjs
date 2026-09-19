import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "kraviona";

import mongoose from "mongoose";
const { Auth } = await import("../src/models/auth/auth.models.js");
const { ContentPlanItem } = await import("../src/models/ContentPlanItem.js");
const { KeywordItem } = await import("../src/models/KeywordItem.js");

// Robust CSV parser handling multiline quoted cells
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i++;
      }
      row.push(field.trim());
      field = "";
      if (row.some(f => f.length > 0)) {
        rows.push(row);
      }
      row = [];
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some(f => f.length > 0)) {
      rows.push(row);
    }
  }
  return rows;
}

// Convert "Oct 5", "Nov 4", "Jan 6", etc. to Date
function parseCalendarDate(monthStr, dateStr) {
  // monthStr: "Oct 2026", "Jan 2027"
  // dateStr: "Oct 5", "Nov 11", "Jan 13", "Feb 3", "Mar 10"
  let year = 2026;
  if (monthStr && (monthStr.includes("2027") || monthStr.includes("Jan") || monthStr.includes("Feb") || monthStr.includes("Mar"))) {
    year = 2027;
  }
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const parts = dateStr.replace(/[^A-Za-z0-9 ]/g, "").trim().split(/\s+/);
  if (parts.length >= 2) {
    const m = months[parts[0]];
    const d = parseInt(parts[1], 10);
    if (m !== undefined && !isNaN(d)) {
      return new Date(Date.UTC(year, m, d, 9, 0, 0));
    }
  }

  // Fallback to default
  return new Date(Date.UTC(year, 9, 1, 9, 0, 0));
}

async function seedData() {
  try {
    console.log("Connecting to MongoDB Atlas...", mongoUri ? "URI present" : "URI missing");
    await mongoose.connect(mongoUri, { dbName });
    console.log("✅ Connected to MongoDB Atlas");

    // Fetch existing users to link assignees
    const users = await Auth.find().lean();
    console.log(`Found ${users.length} users in database`);

    const userMap = {};
    for (const u of users) {
      if (u.name) userMap[u.name.toLowerCase()] = u._id;
      if (u.username) userMap[u.username.toLowerCase()] = u._id;
    }
    // Find default admin / super_admin
    const defaultAdmin = users.find(u => u.role === "super_admin") || users[0];

    const getAssigneeId = (assignedStr) => {
      if (!assignedStr) return defaultAdmin?._id || null;
      const lower = assignedStr.toLowerCase();
      if (lower.includes("amar")) {
        const found = Object.keys(userMap).find(k => k.includes("amar"));
        if (found) return userMap[found];
      }
      if (lower.includes("sonali")) {
        const found = Object.keys(userMap).find(k => k.includes("sonali"));
        if (found) return userMap[found];
      }
      return defaultAdmin?._id || null;
    };

    // ============================================================
    // 1. IMPORT 6-MONTH CONTENT CALENDAR
    // ============================================================
    const calFilePath = path.join(rootDir, "6_month_calendar.csv");
    if (fs.existsSync(calFilePath)) {
      console.log("\nReading 6_month_calendar.csv...");
      const calContent = fs.readFileSync(calFilePath, "utf-8");
      const rows = parseCSV(calContent);
      console.log(`Parsed ${rows.length} rows from 6_month_calendar.csv`);

      let calendarImportCount = 0;
      // Row 0: Title, Row 1: Headers
      for (let r = 2; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.length < 5 || !row[3]) continue;

        const monthStr = row[0]; // e.g. "Oct 2026"
        const weekStr = row[1];  // e.g. "W1"
        const dateStr = row[2];  // e.g. "Oct 5"
        const title = row[3];    // e.g. "Fix 301 Redirects for 7 x 404 URLs"
        const keywordRaw = row[4]; // e.g. "web performance optimization techniques"
        const volRaw = row[5];
        const cluster = row[6];
        const intent = row[7];
        const priorityRaw = row[8];
        const actionType = row[9];
        const assignedToRaw = row[10];

        const plannedDate = parseCalendarDate(monthStr, dateStr);
        const keyword = (keywordRaw === "[Technical Fix]" || keywordRaw === "[Link Building]" || keywordRaw === "[Optimization]" || keywordRaw === "[Review]") ? "" : keywordRaw;

        // Map type
        let type = "Blog";
        if (actionType?.includes("Fix") || actionType?.includes("Redirect") || actionType?.includes("Meta") || actionType?.includes("Canonical") || actionType?.includes("Disavow") || keywordRaw === "[Technical Fix]") {
          type = "SEO Fix";
        } else if (actionType?.includes("Review")) {
          type = "Other";
        }

        // Map priority
        let priority = "Medium";
        if (priorityRaw === "P0" || priorityRaw?.toLowerCase() === "high") priority = "High";
        else if (priorityRaw === "P1" || priorityRaw?.toLowerCase() === "medium" || priorityRaw?.toLowerCase() === "med") priority = "Medium";
        else if (priorityRaw?.toLowerCase() === "low") priority = "Low";

        const notes = `Month: ${monthStr} (${weekStr}) | Type: ${actionType || "Editorial"} | Cluster: ${cluster || "General"} | Volume: ${volRaw || "—"}`;
        const assignee = getAssigneeId(assignedToRaw);

        // Check if item already exists by title and plannedDate
        const existing = await ContentPlanItem.findOne({ title });
        if (existing) {
          existing.plannedDate = plannedDate;
          existing.type = type;
          existing.priority = priority;
          existing.keyword = keyword || existing.keyword;
          existing.notes = notes;
          existing.assignedTo = assignee || existing.assignedTo;
          await existing.save();
        } else {
          await ContentPlanItem.create({
            title,
            keyword: keyword || "",
            type,
            status: "Planned",
            priority,
            plannedDate,
            assignedTo: assignee,
            createdBy: defaultAdmin?._id || null,
            notes,
          });
          calendarImportCount++;
        }
      }
      console.log(`✅ Imported/Updated ${calendarImportCount} content calendar items`);
    }

    // ============================================================
    // 2. IMPORT TECHNICAL SEO FIXES
    // ============================================================
    const techFilePath = path.join(rootDir, "technical_fixes.csv");
    if (fs.existsSync(techFilePath)) {
      console.log("\nReading technical_fixes.csv...");
      const techContent = fs.readFileSync(techFilePath, "utf-8");
      const techRows = parseCSV(techContent);
      console.log(`Parsed ${techRows.length} rows from technical_fixes.csv`);

      let techImportCount = 0;
      for (let r = 2; r < techRows.length; r++) {
        const row = techRows[r];
        if (!row || row.length < 4 || !row[1]) continue;

        const issueType = row[1]; // e.g. "🔴 404 Errors"
        const affectedUrls = row[2];
        const fixRequired = row[3];
        const assignedToRaw = row[4];
        const targetDateRaw = row[5]; // e.g. "Oct 7"
        const notesRaw = row[7] || "";

        const plannedDate = parseCalendarDate("Oct 2026", targetDateRaw || "Oct 7");
        const title = `${issueType.replace(/^[🔴🟡🟢]\s*/, "SEO Fix: ")} — ${fixRequired.split(".")[0]}`.slice(0, 190);
        const assignee = getAssigneeId(assignedToRaw);

        const existing = await ContentPlanItem.findOne({ title });
        if (!existing) {
          await ContentPlanItem.create({
            title,
            type: "SEO Fix",
            status: "Planned",
            priority: issueType.includes("🔴") ? "High" : "Medium",
            plannedDate,
            assignedTo: assignee,
            createdBy: defaultAdmin?._id || null,
            notes: `Issue: ${issueType}\nAffected: ${affectedUrls}\nFix Required: ${fixRequired}\nNotes: ${notesRaw}`,
          });
          techImportCount++;
        }
      }
      console.log(`✅ Imported ${techImportCount} technical SEO fix items`);
    }

    // ============================================================
    // 3. IMPORT KEYWORD TRACKER
    // ============================================================
    const kwFilePath = path.join(rootDir, "keyword_tracker.csv");
    if (fs.existsSync(kwFilePath)) {
      console.log("\nReading keyword_tracker.csv...");
      const kwContent = fs.readFileSync(kwFilePath, "utf-8");
      const kwRows = parseCSV(kwContent);
      console.log(`Parsed ${kwRows.length} rows from keyword_tracker.csv`);

      let kwImportCount = 0;
      for (let r = 3; r < kwRows.length; r++) {
        const row = kwRows[r];
        if (!row || row.length < 5 || !row[1]) continue;

        const keywordText = row[1].trim().toLowerCase();
        const targetUrl = row[2] || "";
        const cluster = row[3] || "General";
        const priorityRaw = row[4];
        const volumeRaw = parseInt((row[5] || "").replace(/[^0-9]/g, ""), 10) || 0;
        const baselinePos = row[6] || "";
        const statusRaw = row[14] || "Researched";

        let status = "Researched";
        if (statusRaw.includes("Top 5") || statusRaw.includes("Page 2")) {
          status = "Ranking";
        } else if (statusRaw.includes("Track")) {
          status = "Assigned";
        }

        const existing = await KeywordItem.findOne({ keyword: keywordText });
        if (existing) {
          existing.targetUrl = targetUrl || existing.targetUrl;
          existing.cluster = cluster || existing.cluster;
          existing.monthlyVolume = volumeRaw || existing.monthlyVolume;
          existing.status = status;
          await existing.save();
        } else {
          await KeywordItem.create({
            keyword: keywordText,
            intent: "Informational",
            monthlyVolume: volumeRaw,
            difficulty: volumeRaw > 5000 ? 55 : volumeRaw > 2000 ? 35 : 20,
            cluster: cluster || "General",
            targetUrl,
            status,
            notes: baselinePos ? `Baseline GSC position: ${baselinePos}` : "",
            createdBy: defaultAdmin?._id || null,
          });
          kwImportCount++;
        }
      }
      console.log(`✅ Imported/Updated ${kwImportCount} keywords into Keyword Planner`);
    }

    console.log("\n🎉 ALL 6-MONTH PLANNER AND KEYWORD DATA SUCCESSFULLY IMPORTED!\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedData();
