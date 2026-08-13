import { ActivityLog } from "../models/analytics/activity-log.model.js";

const getIp = (req) => String(req?.headers?.["x-forwarded-for"] || req?.ip || "").split(",")[0].trim();

export const recordActivity = (req, { userID, module, action, resourceId, resourceName, before = null, after = null }) =>
  ActivityLog.create({
    userID,
    module,
    action,
    resourceId: resourceId ? String(resourceId) : "",
    resourceName: resourceName || "",
    ipAddress: getIp(req),
    userAgent: req?.get?.("user-agent") || "",
    before,
    after,
  }).catch((error) => console.error("Unable to record activity:", error.message));
