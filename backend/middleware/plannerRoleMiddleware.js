// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
import { ContentPlanItem } from "../models/ContentPlanItem.js";

export const PLANNER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  TEAM_MEMBER: "team_member",
};

export const resolvePlannerRole = (user) => {
  if (!user) return null;
  const rawRole = String(user.plannerRole || user.role || "").toLowerCase().trim();

  if (rawRole === "super_admin" || rawRole === "superadmin") {
    return PLANNER_ROLES.SUPER_ADMIN;
  }
  if (rawRole === "admin") {
    return PLANNER_ROLES.ADMIN;
  }
  return PLANNER_ROLES.TEAM_MEMBER;
};

export const attachPlannerRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required for planner access",
    });
  }
  req.plannerRole = resolvePlannerRole(req.user);
  next();
};

export const requirePlannerUser = (req, res, next) => {
  attachPlannerRole(req, res, () => {
    if (!req.plannerRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Planner access denied",
      });
    }
    next();
  });
};

export const requirePlannerAdmin = (req, res, next) => {
  attachPlannerRole(req, res, () => {
    if (
      req.plannerRole !== PLANNER_ROLES.SUPER_ADMIN &&
      req.plannerRole !== PLANNER_ROLES.ADMIN
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin or Super Admin role required",
      });
    }
    next();
  });
};

export const requirePlannerSuperAdmin = (req, res, next) => {
  attachPlannerRole(req, res, () => {
    if (req.plannerRole !== PLANNER_ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Super Admin role required",
      });
    }
    next();
  });
};

export const canUpdatePlannerItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await ContentPlanItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Planner item not found",
      });
    }

    req.plannerItem = item;
    const role = req.plannerRole || resolvePlannerRole(req.user);
    const userId = String(req.user.id || req.user._id);

    if (role === PLANNER_ROLES.SUPER_ADMIN) {
      return next();
    }

    if (role === PLANNER_ROLES.ADMIN) {
      return next();
    }

    if (role === PLANNER_ROLES.TEAM_MEMBER) {
      const isAssignee = item.assignedTo && String(item.assignedTo) === userId;
      if (!isAssignee) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only update tasks assigned to you",
        });
      }

      const keys = Object.keys(req.body);
      const allowedKeys = ["status"];
      const invalidKeys = keys.filter((k) => !allowedKeys.includes(k));

      if (invalidKeys.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Team members can only update task status",
        });
      }

      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to authorize planner item update",
    });
  }
};

export default {
  PLANNER_ROLES,
  resolvePlannerRole,
  attachPlannerRole,
  requirePlannerUser,
  requirePlannerAdmin,
  requirePlannerSuperAdmin,
  canUpdatePlannerItem,
};
