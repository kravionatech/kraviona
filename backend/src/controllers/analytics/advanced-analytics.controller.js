import mongoose from "mongoose";
import { Auth } from "../../models/auth/auth.models.js";
import { PostModel } from "../../models/blog/post.model.js";
import Lead from "../../models/leads/lead.model.js";
import { mediaModel } from "../../models/media/media.model.js";
import { LoginHistory } from "../../models/auth/login-history.model.js";
import { ActivityLog } from "../../models/analytics/activity-log.model.js";
import { Service } from "../../models/services/service.model.js";
import { Project } from "../../models/portfolio/project.model.js";
import { TeamMemberModel } from "../../models/team/team.model.js";

const CONTENT_ROLES = ["super_admin", "admin", "editor"];
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const dateKey = (date) => new Date(date).toISOString().slice(0, 10);
const dateLabel = (date) => new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

function getRange(query) {
  const now = new Date();
  const range = query.range || "30d";
  let start;
  let end = endOfDay(now);

  if (range === "today") start = startOfDay(now);
  else if (range === "yesterday") {
    start = startOfDay(new Date(now.getTime() - DAY_MS));
    end = endOfDay(start);
  } else if (range === "7d" || range === "30d" || range === "90d") {
    start = startOfDay(new Date(now.getTime() - (Number.parseInt(range, 10) - 1) * DAY_MS));
  } else if (range === "this-month") start = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (range === "last-month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (range === "custom" && query.start && query.end) {
    start = startOfDay(query.start);
    end = endOfDay(query.end);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) throw new Error("Choose a valid custom date range.");
    if (end.getTime() - start.getTime() > 366 * DAY_MS) throw new Error("Custom range cannot be longer than 12 months.");
  } else {
    start = startOfDay(new Date(now.getTime() - 29 * DAY_MS));
  }

  return { range, start, end };
}

async function countByDay(Model, match, start, end) {
  const rows = await Model.aggregate([
    { $match: { ...match, createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, value: { $sum: 1 } } },
  ]);
  return new Map(rows.map((row) => [row._id, row.value]));
}

function buildTimeline(start, end, series) {
  const rows = [];
  for (let date = startOfDay(start); date <= end; date = new Date(date.getTime() + DAY_MS)) {
    const key = dateKey(date);
    rows.push({
      date: key,
      label: dateLabel(date),
      posts: series.posts.get(key) || 0,
      services: series.services.get(key) || 0,
      projects: series.projects.get(key) || 0,
      media: series.media.get(key) || 0,
      leads: series.leads.get(key) || 0,
      activity: series.activity.get(key) || 0,
    });
  }
  return rows;
}

const coverage = (count, total) => (total ? Math.round((count / total) * 100) : 0);

export const getAdvancedAnalytics = async (req, res) => {
  try {
    if (!CONTENT_ROLES.includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: "You are not authorized to view this data." });
    }

    const { range, start, end } = getRange(req.query);
    const isSuperAdmin = req.user.role === "super_admin";
    const ownId = req.user.id;
    const postScope = isSuperAdmin ? {} : { userID: ownId };
    const serviceScope = isSuperAdmin ? {} : { createdBy: ownId };
    const projectScope = isSuperAdmin ? {} : { createdBy: ownId };
    const mediaScope = isSuperAdmin ? {} : { userID: ownId };
    const activityScope = isSuperAdmin ? {} : { userID: ownId };
    const loginScope = isSuperAdmin ? {} : { user: ownId };
    const dateMatch = { createdAt: { $gte: start, $lte: end } };
    const rangeDuration = Math.max(end.getTime() - start.getTime() + 1, DAY_MS);
    const previousEnd = new Date(start.getTime() - 1);
    const previousStart = new Date(start.getTime() - rangeDuration);
    const previousDateMatch = { createdAt: { $gte: previousStart, $lte: previousEnd } };

    const [posts, services, projects, media, leads, users, timelineSeries, seoPosts, activityLogs, loginHistory] = await Promise.all([
      PostModel.countDocuments({ ...postScope, ...dateMatch }),
      Service.countDocuments({ ...serviceScope, ...dateMatch }),
      Project.countDocuments({ ...projectScope, ...dateMatch }),
      mediaModel.countDocuments({ ...mediaScope, isDeleted: { $ne: true }, ...dateMatch }),
      isSuperAdmin ? Lead.countDocuments(dateMatch) : Promise.resolve(0),
      isSuperAdmin ? Auth.countDocuments(dateMatch) : Promise.resolve(0),
      Promise.all([
        countByDay(PostModel, postScope, start, end),
        countByDay(Service, serviceScope, start, end),
        countByDay(Project, projectScope, start, end),
        countByDay(mediaModel, { ...mediaScope, isDeleted: { $ne: true } }, start, end),
        isSuperAdmin ? countByDay(Lead, {}, start, end) : Promise.resolve(new Map()),
        countByDay(ActivityLog, activityScope, start, end),
      ]),
      PostModel.find(postScope).select("title slug status views metaTitle metaDescription ogImage isNoIndex readingTimeMinutes createdAt").lean(),
      ActivityLog.find({ ...activityScope, ...dateMatch }).sort({ createdAt: -1 }).limit(25).populate("userID", "name avatar role").lean(),
      LoginHistory.find({ ...loginScope, ...dateMatch }).sort({ createdAt: -1 }).limit(25).populate("user", "name avatar role").lean(),
    ]);

    const [postDays, serviceDays, projectDays, mediaDays, leadDays, activityDays] = timelineSeries;
    const timeline = buildTimeline(start, end, { posts: postDays, services: serviceDays, projects: projectDays, media: mediaDays, leads: leadDays, activity: activityDays });

    const [published, draft, activeServices, activeProjects] = await Promise.all([
      PostModel.countDocuments({ ...postScope, ...dateMatch, status: "published" }),
      PostModel.countDocuments({ ...postScope, ...dateMatch, status: "draft" }),
      Service.countDocuments({ ...serviceScope, isActive: true }),
      Project.countDocuments({ ...projectScope, isActive: true }),
    ]);

    const [previousPosts, previousServices, previousProjects, previousLeads, previousUsers] = await Promise.all([
      PostModel.countDocuments({ ...postScope, ...previousDateMatch }),
      Service.countDocuments({ ...serviceScope, ...previousDateMatch }),
      Project.countDocuments({ ...projectScope, ...previousDateMatch }),
      isSuperAdmin ? Lead.countDocuments(previousDateMatch) : Promise.resolve(0),
      isSuperAdmin ? Auth.countDocuments(previousDateMatch) : Promise.resolve(0),
    ]);

    const seo = {
      total: seoPosts.length,
      indexed: seoPosts.filter((post) => post.status === "published" && !post.isNoIndex).length,
      noIndex: seoPosts.filter((post) => post.isNoIndex).length,
      metaTitle: seoPosts.filter((post) => Boolean(post.metaTitle?.trim())).length,
      metaDescription: seoPosts.filter((post) => Boolean(post.metaDescription?.trim())).length,
      ogImage: seoPosts.filter((post) => Boolean(post.ogImage?.trim())).length,
    };
    seo.score = Math.round((coverage(seo.metaTitle, seo.total) + coverage(seo.metaDescription, seo.total) + coverage(seo.ogImage, seo.total)) / 3);

    const managedServices = await Service.find(serviceScope).select("title slug createdAt").sort({ createdAt: -1 }).limit(8).lean();
    const serviceNames = managedServices.map((service) => service.title);
    const inquiries = isSuperAdmin && serviceNames.length
      ? await Lead.aggregate([{ $match: { ...dateMatch, service: { $in: serviceNames } } }, { $group: { _id: "$service", value: { $sum: 1 } } }])
      : [];
    const inquiryMap = new Map(inquiries.map((item) => [item._id, item.value]));
    const servicePerformance = managedServices.map((service) => ({ name: service.title, inquiries: inquiryMap.get(service.title) || 0 }));

    const topPosts = seoPosts
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 7)
      .map((post) => ({ title: post.title, slug: post.slug, views: post.views || 0, status: post.status, readTime: post.readingTimeMinutes || 1 }));

    const workspace = isSuperAdmin
      ? await (async () => {
          const [
            totalUsers,
            activeUsers,
            totalTeam,
            activeTeam,
            totalPosts,
            totalServices,
            totalProjects,
            openLeads,
            roleRows,
            pipelineRows,
            wonValueRows,
            loginsInRange,
          ] = await Promise.all([
            Auth.countDocuments(),
            Auth.countDocuments({ isActive: true }),
            TeamMemberModel.countDocuments(),
            TeamMemberModel.countDocuments({ status: "active" }),
            PostModel.countDocuments(),
            Service.countDocuments(),
            Project.countDocuments(),
            Lead.countDocuments({ status: { $nin: ["Won", "Lost"] }, isArchived: { $ne: true } }),
            Auth.aggregate([{ $group: { _id: "$role", value: { $sum: 1 } } }, { $sort: { value: -1 } }]),
            Lead.aggregate([{ $match: { isArchived: { $ne: true } } }, { $group: { _id: "$status", value: { $sum: 1 } } }]),
            Lead.aggregate([{ $match: { status: "Won" } }, { $group: { _id: null, value: { $sum: "$dealValue" } } }]),
            LoginHistory.countDocuments(dateMatch),
          ]);

          return {
            totalUsers,
            activeUsers,
            totalTeam,
            activeTeam,
            totalPosts,
            totalServices,
            totalProjects,
            openLeads,
            wonValue: wonValueRows[0]?.value || 0,
            loginsInRange,
            roleDistribution: roleRows.map((item) => ({ name: item._id || "unknown", value: item.value })),
            pipeline: ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"].map((name) => ({
              name,
              value: pipelineRows.find((item) => item._id === name)?.value || 0,
            })),
          };
        })()
      : null;

    const recordedLoginKeys = new Set(
      activityLogs
        .filter((item) => item.module === "security" && item.action === "login")
        .map((item) => `${item.userID?._id || item.userID}:${new Date(item.createdAt).toISOString().slice(0, 16)}`),
    );
    const activity = [
      ...activityLogs.map((item) => ({
        id: `activity-${item._id}`,
        type: "activity",
        user: item.userID?.name || "Unknown user",
        avatar: item.userID?.avatar || "",
        role: item.userID?.role || "",
        module: item.module,
        action: item.action,
        resourceName: item.resourceName,
        ipAddress: item.ipAddress,
        userAgent: item.userAgent,
        before: item.before,
        after: item.after,
        createdAt: item.createdAt,
      })),
      ...loginHistory.filter((item) => !recordedLoginKeys.has(`${item.user?._id || item.user}:${new Date(item.createdAt).toISOString().slice(0, 16)}`)).map((item) => ({
        id: `login-${item._id}`,
        type: "login",
        user: item.user?.name || "Unknown user",
        avatar: item.user?.avatar || "",
        role: item.user?.role || "",
        module: "security",
        action: "login",
        resourceName: "Admin panel",
        ipAddress: item.ipAddress,
        userAgent: item.userAgent,
        before: null,
        after: null,
        createdAt: item.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);

    return res.status(200).json({
      success: true,
      data: {
        scope: isSuperAdmin ? "workspace" : "personal",
        range: { key: range, start, end },
        kpis: { users, services, posts, projects, media, leads, published, draft, activeServices, activeProjects, seoScore: seo.score },
        comparison: { users: previousUsers, services: previousServices, posts: previousPosts, projects: previousProjects, leads: previousLeads },
        timeline,
        seo,
        servicePerformance,
        topPosts,
        activity,
        heatmap: timeline.map((item) => ({ date: item.date, value: item.activity })),
        tracking: { configured: false, message: "Visitor tracking is not connected yet. Content and activity analytics are live." },
        workspace,
        system: isSuperAdmin ? { database: mongoose.connection.readyState === 1 ? "connected" : "unavailable", auditEvents: activityLogs.length } : null,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to load analytics." });
  }
};
