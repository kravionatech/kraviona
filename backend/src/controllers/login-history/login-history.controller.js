import { LoginHistory } from "../../models/auth/login-history.model.js";

const getIp = (req) => String(req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim();

export const recordLogin = (user, req, method = "password") =>
  LoginHistory.create({ user: user._id || user.id, ipAddress: getIp(req), userAgent: req.get("user-agent") || "", method });

export const getLoginHistory = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const isSuperAdmin = req.user.role === "super_admin";
    const requestedUserId = req.query.userId;

    if (requestedUserId && !isSuperAdmin && String(requestedUserId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const user = isSuperAdmin && requestedUserId ? requestedUserId : req.user.id;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const query = isSuperAdmin && !requestedUserId ? {} : { user };
    const [data, total] = await Promise.all([
      LoginHistory.find(query).populate("user", "name email username avatar role").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      LoginHistory.countDocuments(query),
    ]);
    return res.status(200).json({ success: true, message: data.length ? "Login history fetched" : "No data found.", data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Unable to fetch login history" });
  }
};
