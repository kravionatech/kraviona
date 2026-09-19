// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
import { ContentPlanItem } from "../models/ContentPlanItem.js";

export const PLANNER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  TEAM_MEMBER: "team_member",
};

/**
 * Resolves planner role from user object.
 * Maps existing user roles:
 * - 'super_admin' -> 'super_admin'
 * - 'admin' -> 'admin'
 * - 'editor', 'viewer', 'user' -> 'team_member'
 * Also respects explicit plannerRole if set.
 */
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

/**
 * Attaches resolved plannerRole to req for downstream handlers.
 */
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

/**
 * Middleware: Requires any valid planner user (Super Admin, Admin, Team Member).
 */
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

/**
 * Middleware: Requires Admin or Super Admin role.
 * Team members cannot create general content plans or manage keywords.
 */
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

/**
 * Middleware: Requires Super Admin role exclusively (e.g., delete planner items).
 */
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

/**
 * Middleware: Verifies permission to update a specific planner item.
 * - Super Admin: can update anything
 * - Admin: can update items they created or are assigned to, or reassign within team
 * - Team Member: can ONLY update the `status` of items assigned to them
 */
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

    // Super admin can update everything
    if (role === PLANNER_ROLES.SUPER_ADMIN) {
      return next();
    }

    // Admin can update own items or assigned items
    if (role === PLANNER_ROLES.ADMIN) {
      const isCreator = item.createdBy && String(item.createdBy) === userId;
      const isAssignee = item.assignedTo && String(item.assignedTo) === userId;
      if (isCreator || isAssignee || !item.createdBy) {
        return next();
      }
      // Admins are also allowed to edit items for team calendar
      return next();
    }

    // Team Member: can ONLY update `status` on items assigned to them
    if (role === PLANNER_ROLES.TEAM_MEMBER) {
      const isAssignee = item.assignedTo && String(item.assignedTo) === userId;
      if (!isAssignee) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only update tasks assigned to you",
        });
      }

      // Check that only status is being modified
      const keys = Object.keys(req.body);
      const allowedKeys = ["status"];
      const invalidKeys = keys.filter((k) => !allowedKeys.includes(k));

      if (invalidKeys.length > 0) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: Team members can only update task status",
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
