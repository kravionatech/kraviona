// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  PLANNER_ROLES,
  resolvePlannerRole,
  requirePlannerUser,
  requirePlannerAdmin,
  requirePlannerSuperAdmin,
  canUpdatePlannerItem,
} from "../middleware/plannerRoleMiddleware.js";
import { ContentPlanItem } from "../models/ContentPlanItem.js";
import { KeywordItem } from "../models/KeywordItem.js";

const router = express.Router();

// Apply auth + planner role check to all planner endpoints
router.use(verifyToken);
router.use(requirePlannerUser);

// ============================================================
// HELPER: Auto-detect 90-day decay for items
// ============================================================
const isOlderThan90Days = (date) => {
  if (!date) return false;
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(date).getTime() > ninetyDaysMs;
};

// ============================================================
// CONTENT PLAN ITEMS ROUTES
// ============================================================

/**
 * GET /api/planner/items/stats
 * Stats: Monthly completion %, counts by status, decay/needs update counts
 */
router.get("/items/stats", async (req, res) => {
  try {
    const role = req.plannerRole || resolvePlannerRole(req.user);
    const userId = req.user.id || req.user._id;

    const now = new Date();
    const month = parseInt(req.query.month || now.getMonth() + 1, 10);
    const year = parseInt(req.query.year || now.getFullYear(), 10);

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const baseFilter = {};
    if (role === PLANNER_ROLES.TEAM_MEMBER) {
      baseFilter.assignedTo = userId;
    }

    const monthFilter = {
      ...baseFilter,
      plannedDate: { $gte: startOfMonth, $lte: endOfMonth },
    };

    const [allMonthItems, allItems] = await Promise.all([
      ContentPlanItem.find(monthFilter).lean(),
      ContentPlanItem.find(baseFilter).lean(),
    ]);

    // Calculate monthly stats
    const totalMonthTasks = allMonthItems.length;
    const completedMonthTasks = allMonthItems.filter((item) =>
      ["Done", "Published", "Indexed"].includes(item.status)
    ).length;
    const monthlyCompletionPercentage =
      totalMonthTasks > 0
        ? Math.round((completedMonthTasks / totalMonthTasks) * 100)
        : 0;

    // Status counts across all items
    const statusCounts = {
      Planned: 0,
      "In Progress": 0,
      Done: 0,
      Published: 0,
      Indexed: 0,
      "Needs Update": 0,
    };

    let needsUpdateCount = 0;
    let publishedNotIndexedCount = 0;

    for (const item of allItems) {
      if (statusCounts[item.status] !== undefined) {
        statusCounts[item.status]++;
      }

      // Check 90-day decay
      const refDate = item.publishedDate || item.plannedDate;
      const decayFlag = item.isOutdated || (["Done", "Published", "Indexed"].includes(item.status) && isOlderThan90Days(refDate));
      if (decayFlag || item.status === "Needs Update") {
        needsUpdateCount++;
      }

      // Published but not indexed
      if (item.status === "Published") {
        publishedNotIndexedCount++;
      }
    }

    return res.status(200).json({
      success: true,
      stats: {
        month,
        year,
        totalMonthTasks,
        completedMonthTasks,
        monthlyCompletionPercentage,
        statusCounts,
        needsUpdateCount,
        publishedNotIndexedCount,
        totalAllItems: allItems.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch planner stats",
    });
  }
});

/**
 * GET /api/planner/items/calendar
 * Items grouped by date for month/week calendar view
 */
router.get("/items/calendar", async (req, res) => {
  try {
    const role = req.plannerRole || resolvePlannerRole(req.user);
    const userId = req.user.id || req.user._id;

    const now = new Date();
    const month = parseInt(req.query.month || now.getMonth() + 1, 10);
    const year = parseInt(req.query.year || now.getFullYear(), 10);

    // Cover a little margin around the month for calendar grid display (prev & next month overflow)
    const startDate = new Date(year, month - 1, 1 - 7);
    const endDate = new Date(year, month, 14, 23, 59, 59, 999);

    const query = {
      plannedDate: { $gte: startDate, $lte: endDate },
    };

    if (role === PLANNER_ROLES.TEAM_MEMBER) {
      query.assignedTo = userId;
    }

    const items = await ContentPlanItem.find(query)
      .populate("assignedTo", "name email username avatar role")
      .populate("createdBy", "name email")
      .sort({ plannedDate: 1, priority: -1 })
      .lean();

    // Group items by date string (YYYY-MM-DD)
    const groupedByDate = {};

    for (const item of items) {
      const dateKey = new Date(item.plannedDate).toISOString().split("T")[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          tasks: [],
          totalTasks: 0,
          completedTasks: 0,
          completionPercentage: 0,
        };
      }

      groupedByDate[dateKey].tasks.push(item);
      groupedByDate[dateKey].totalTasks++;
      if (["Done", "Published", "Indexed"].includes(item.status)) {
        groupedByDate[dateKey].completedTasks++;
      }
    }

    // Calculate percentage per date
    for (const key of Object.keys(groupedByDate)) {
      const entry = groupedByDate[key];
      entry.completionPercentage =
        entry.totalTasks > 0
          ? Math.round((entry.completedTasks / entry.totalTasks) * 100)
          : 0;
    }

    // Overall month calculation
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
    const thisMonthItems = items.filter((item) => {
      const d = new Date(item.plannedDate);
      return d >= monthStart && d <= monthEnd;
    });

    const monthTotal = thisMonthItems.length;
    const monthCompleted = thisMonthItems.filter((item) =>
      ["Done", "Published", "Indexed"].includes(item.status)
    ).length;
    const monthlyCompletionPercentage =
      monthTotal > 0 ? Math.round((monthCompleted / monthTotal) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        month,
        year,
        monthlyTotal: monthTotal,
        monthlyCompleted: monthCompleted,
        monthlyCompletionPercentage,
        calendarDays: groupedByDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch calendar data",
    });
  }
});

/**
 * GET /api/planner/items
 * All items filterable by status, date, type, assignedTo, search, isOutdated
 */
router.get("/items", async (req, res) => {
  try {
    const role = req.plannerRole || resolvePlannerRole(req.user);
    const userId = req.user.id || req.user._id;

    const {
      status,
      type,
      assignedTo,
      date,
      startDate,
      endDate,
      search,
      isOutdated,
      limit = 100,
      page = 1,
    } = req.query;

    const query = {};

    // Role restriction: team members can only view their own assigned items
    if (role === PLANNER_ROLES.TEAM_MEMBER) {
      query.assignedTo = userId;
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (isOutdated === "true" || isOutdated === true) {
      query.$or = [
        { isOutdated: true },
        { status: "Needs Update" },
      ];
    }

    // Specific date or date range
    if (date) {
      const d = new Date(date);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));
      query.plannedDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate || endDate) {
      query.plannedDate = {};
      if (startDate) query.plannedDate.$gte = new Date(startDate);
      if (endDate) query.plannedDate.$lte = new Date(endDate);
    }

    // Search by title, keyword, or notes
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { keyword: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const parsedLimit = Math.min(parseInt(limit, 10), 200);

    const [items, total] = await Promise.all([
      ContentPlanItem.find(query)
        .populate("assignedTo", "name email username avatar role")
        .populate("createdBy", "name email")
        .sort({ plannedDate: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      ContentPlanItem.countDocuments(query),
    ]);

    // Enhance items with dynamic decay flag (older than 90 days)
    const enhancedItems = items.map((item) => {
      const refDate = item.publishedDate || item.plannedDate;
      const decay = item.isOutdated || (["Done", "Published", "Indexed"].includes(item.status) && isOlderThan90Days(refDate));
      return {
        ...item,
        isOutdated: Boolean(decay),
        needsGscCheck: item.status === "Published",
      };
    });

    return res.status(200).json({
      success: true,
      items: enhancedItems,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch planner items",
    });
  }
});

/**
 * GET /api/planner/items/:id
 * Single planner item
 */
router.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ContentPlanItem.findById(id)
      .populate("assignedTo", "name email username avatar role")
      .populate("createdBy", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Planner item not found",
      });
    }

    const role = req.plannerRole || resolvePlannerRole(req.user);
    const userId = String(req.user.id || req.user._id);

    if (
      role === PLANNER_ROLES.TEAM_MEMBER &&
      String(item.assignedTo?._id || item.assignedTo) !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only view items assigned to you",
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch item",
    });
  }
});

/**
 * POST /api/planner/items
 * Create new planner item (Admin or Super Admin only)
 */
router.post("/items", requirePlannerAdmin, async (req, res) => {
  try {
    const {
      title,
      keyword,
      type,
      status,
      priority,
      plannedDate,
      publishedDate,
      assignedTo,
      targetUrl,
      notes,
      linkedPostSlug,
    } = req.body;

    if (!title || !plannedDate) {
      return res.status(400).json({
        success: false,
        message: "Title and planned date are required",
      });
    }

    const newItem = new ContentPlanItem({
      title,
      keyword: keyword || "",
      type: type || "Blog",
      status: status || "Planned",
      priority: priority || "Medium",
      plannedDate: new Date(plannedDate),
      publishedDate: publishedDate ? new Date(publishedDate) : null,
      assignedTo: assignedTo || null,
      createdBy: req.user.id || req.user._id,
      targetUrl: targetUrl || "",
      notes: notes || "",
      linkedPostSlug: linkedPostSlug || "",
      isOutdated: status === "Needs Update",
      lastUpdated: new Date(),
    });

    await newItem.save();
    await newItem.populate("assignedTo", "name email username avatar role");

    return res.status(201).json({
      success: true,
      message: "Content plan item created successfully",
      item: newItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create planner item",
    });
  }
});

/**
 * PATCH /api/planner/items/:id
 * Update status/fields on planner item
 * - Super admin: all fields
 * - Admin: all fields on own/team items
 * - Team member: status only on assigned items
 */
router.patch("/items/:id", canUpdatePlannerItem, async (req, res) => {
  try {
    const item = req.plannerItem;
    const updates = req.body;

    // Handle status transitions
    if (updates.status) {
      item.status = updates.status;
      if (
        (updates.status === "Published" || updates.status === "Indexed") &&
        !item.publishedDate
      ) {
        item.publishedDate = new Date();
      }
      if (updates.status === "Needs Update") {
        item.isOutdated = true;
      }
    }

    // If non-team-member, update allowed fields
    const role = req.plannerRole || resolvePlannerRole(req.user);
    if (role !== PLANNER_ROLES.TEAM_MEMBER) {
      if (updates.title !== undefined) item.title = updates.title;
      if (updates.keyword !== undefined) item.keyword = updates.keyword;
      if (updates.type !== undefined) item.type = updates.type;
      if (updates.priority !== undefined) item.priority = updates.priority;
      if (updates.plannedDate !== undefined)
        item.plannedDate = new Date(updates.plannedDate);
      if (updates.publishedDate !== undefined)
        item.publishedDate = updates.publishedDate
          ? new Date(updates.publishedDate)
          : null;
      if (updates.assignedTo !== undefined) item.assignedTo = updates.assignedTo || null;
      if (updates.targetUrl !== undefined) item.targetUrl = updates.targetUrl;
      if (updates.notes !== undefined) item.notes = updates.notes;
      if (updates.linkedPostSlug !== undefined)
        item.linkedPostSlug = updates.linkedPostSlug;
      if (updates.isOutdated !== undefined)
        item.isOutdated = Boolean(updates.isOutdated);
    }

    item.lastUpdated = new Date();
    await item.save();
    await item.populate("assignedTo", "name email username avatar role");

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update planner item",
    });
  }
});

/**
 * DELETE /api/planner/items/:id
 * Delete planner item (Super Admin only)
 */
router.delete("/items/:id", requirePlannerSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ContentPlanItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Planner item not found",
      });
    }

    // If any keyword is linked to this content plan, unlink it
    await KeywordItem.updateMany(
      { assignedContentPlan: id },
      { $set: { assignedContentPlan: null, status: "Researched" } }
    );

    return res.status(200).json({
      success: true,
      message: "Planner item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete planner item",
    });
  }
});

// ============================================================
// KEYWORDS ROUTES
// ============================================================

/**
 * GET /api/planner/keywords
 * All keywords with search/cluster filtering
 */
router.get("/keywords", async (req, res) => {
  try {
    const { cluster, status, search } = req.query;
    const query = {};

    if (cluster) {
      query.cluster = cluster;
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { keyword: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
        { targetUrl: { $regex: search, $options: "i" } },
      ];
    }

    const keywords = await KeywordItem.find(query)
      .populate("assignedContentPlan", "title status plannedDate priority")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Get distinct clusters for filtering
    const clusters = await KeywordItem.distinct("cluster");

    return res.status(200).json({
      success: true,
      keywords,
      clusters: clusters.filter(Boolean),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch keywords",
    });
  }
});

/**
 * POST /api/planner/keywords
 * Add a new keyword (Admin or Super Admin only)
 */
router.post("/keywords", requirePlannerAdmin, async (req, res) => {
  try {
    const {
      keyword,
      intent,
      monthlyVolume,
      difficulty,
      cluster,
      targetUrl,
      status,
      notes,
      assignedContentPlan,
    } = req.body;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword text is required",
      });
    }

    const newKeyword = new KeywordItem({
      keyword: String(keyword).trim().toLowerCase(),
      intent: intent || "Informational",
      monthlyVolume: Number(monthlyVolume) || 0,
      difficulty: Number(difficulty) || 0,
      cluster: cluster ? String(cluster).trim() : "General",
      targetUrl: targetUrl || "",
      status: status || "Researched",
      notes: notes || "",
      assignedContentPlan: assignedContentPlan || null,
      createdBy: req.user.id || req.user._id,
    });

    await newKeyword.save();

    return res.status(201).json({
      success: true,
      message: "Keyword added successfully",
      keyword: newKeyword,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add keyword",
    });
  }
});

/**
 * PATCH /api/planner/keywords/:id
 * Update keyword
 */
router.patch("/keywords/:id", requirePlannerAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const keyword = await KeywordItem.findById(id);
    if (!keyword) {
      return res.status(404).json({
        success: false,
        message: "Keyword not found",
      });
    }

    if (updates.keyword !== undefined)
      keyword.keyword = String(updates.keyword).trim().toLowerCase();
    if (updates.intent !== undefined) keyword.intent = updates.intent;
    if (updates.monthlyVolume !== undefined)
      keyword.monthlyVolume = Number(updates.monthlyVolume);
    if (updates.difficulty !== undefined)
      keyword.difficulty = Number(updates.difficulty);
    if (updates.cluster !== undefined)
      keyword.cluster = String(updates.cluster).trim();
    if (updates.targetUrl !== undefined) keyword.targetUrl = updates.targetUrl;
    if (updates.status !== undefined) keyword.status = updates.status;
    if (updates.notes !== undefined) keyword.notes = updates.notes;
    if (updates.assignedContentPlan !== undefined)
      keyword.assignedContentPlan = updates.assignedContentPlan || null;

    await keyword.save();

    return res.status(200).json({
      success: true,
      message: "Keyword updated successfully",
      keyword,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update keyword",
    });
  }
});

/**
 * DELETE /api/planner/keywords/:id
 * Delete keyword
 */
router.delete("/keywords/:id", requirePlannerAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const keyword = await KeywordItem.findByIdAndDelete(id);

    if (!keyword) {
      return res.status(404).json({
        success: false,
        message: "Keyword not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Keyword deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete keyword",
    });
  }
});

/**
 * POST /api/planner/keywords/:id/plan
 * Create ContentPlanItem directly from Keyword
 */
router.post("/keywords/:id/plan", requirePlannerAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const keywordDoc = await KeywordItem.findById(id);

    if (!keywordDoc) {
      return res.status(404).json({
        success: false,
        message: "Keyword not found",
      });
    }

    const {
      title,
      type = "Blog",
      plannedDate,
      assignedTo,
      priority = "Medium",
      notes,
    } = req.body;

    if (!title || !plannedDate) {
      return res.status(400).json({
        success: false,
        message: "Title and planned date are required to create a plan item",
      });
    }

    const planItem = new ContentPlanItem({
      title,
      keyword: keywordDoc.keyword,
      type,
      status: "Planned",
      priority,
      plannedDate: new Date(plannedDate),
      assignedTo: assignedTo || null,
      createdBy: req.user.id || req.user._id,
      targetUrl: keywordDoc.targetUrl || "",
      notes: notes || keywordDoc.notes || "",
      lastUpdated: new Date(),
    });

    await planItem.save();

    // Link plan back to the keyword item
    keywordDoc.assignedContentPlan = planItem._id;
    keywordDoc.status = "In Content Plan";
    await keywordDoc.save();

    await planItem.populate("assignedTo", "name email username avatar role");

    return res.status(201).json({
      success: true,
      message: "Content plan item created from keyword successfully",
      item: planItem,
      keyword: keywordDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create content plan from keyword",
    });
  }
});

export default router;
