import slugify from "slugify";
import { TeamMemberModel } from "../../models/team/team.model.js";
import { Auth } from "../../models/auth/auth.models.js";
import { hasOwn, parseBoolean } from "../../utils/requestValues.js";

const MANAGER_ROLES = ["super_admin"];
const TEAM_STATUSES = ["active", "inactive"];
const USER_ROLES = ["super_admin", "admin", "editor"];

const canManageTeam = (user) => user && MANAGER_ROLES.includes(user.role);
const cleanText = (value) => String(value || "").trim();

const handleTeamError = (error, res) => {
  if (error.status) {
    return res.status(error.status).json({ success: false, message: error.message });
  }
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Team member already exists with this slug or email",
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Unable to process team request",
  });
};

const normalizeArray = (value) =>
  Array.isArray(value)
    ? value.map((item) => cleanText(item)).filter(Boolean)
    : [];

const normalizeSocialLinks = (links) =>
  Array.isArray(links)
    ? links
        .map((link) => ({
          name: cleanText(link.name),
          url: cleanText(link.url),
        }))
        .filter((link) => link.name || link.url)
    : [];

export const buildTeamPayload = (body = {}, { partial = false } = {}) => {
  const payload = {};
  const include = (key) => !partial || hasOwn(body, key);

  if (include("name")) payload.name = cleanText(body.name);
  if (include("slug")) {
    payload.slug = body.slug
      ? slugify(cleanText(body.slug), { lower: true, strict: true })
      : undefined;
  }
  if (include("email")) {
    payload.email = body.email ? cleanText(body.email).toLowerCase() : undefined;
  }
  if (include("phone")) payload.phone = cleanText(body.phone);
  if (include("designation")) payload.designation = cleanText(body.designation);
  if (include("department")) payload.department = cleanText(body.department) || "General";
  if (include("bio")) payload.bio = cleanText(body.bio);
  if (include("avatar")) payload.avatar = cleanText(body.avatar);
  if (include("skills")) payload.skills = normalizeArray(body.skills);
  if (include("socialLinks")) payload.socialLinks = normalizeSocialLinks(body.socialLinks);
  if (include("userID")) payload.userID = body.userID === "" ? null : body.userID || undefined;
  if (include("role")) payload.role = body.role || undefined;
  if (include("order")) payload.order = body.order === undefined ? 0 : Number(body.order);
  if (include("isFeatured")) payload.isFeatured = parseBoolean(body.isFeatured, false);
  if (include("status")) payload.status = body.status === undefined ? "active" : cleanText(body.status);

  return payload;
};

const resolveLinkedAccount = async (userID, role, department) => {
  if (!userID) return null;
  let account;
  try {
    account = await Auth.findById(userID);
  } catch {
    const error = new Error("Choose a valid user account.");
    error.status = 400;
    throw error;
  }
  if (!account) {
    const error = new Error("Linked user account was not found.");
    error.status = 404;
    throw error;
  }
  if (role && !USER_ROLES.includes(role)) {
    const error = new Error("Invalid account role.");
    error.status = 400;
    throw error;
  }
  let accountChanged = false;
  if (role && account.role !== role) {
    account.role = role;
    accountChanged = true;
  }
  const cleanDepartment = cleanText(department);
  if (cleanDepartment && account.profile?.department !== cleanDepartment) {
    account.profile = {
      ...(account.profile?.toObject?.() || account.profile || {}),
      department: cleanDepartment,
    };
    accountChanged = true;
  }
  if (accountChanged) await account.save();
  return account;
};

export const getAllTeamMembers = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!canManageTeam(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { status, department, search, page = 1, limit = 20 } = req.query;
    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const perPage = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 50);
    const query = {};

    if (status && TEAM_STATUSES.includes(status)) query.status = status;
    if (department) query.department = { $regex: cleanText(department), $options: "i" };
    if (search) {
      const regex = { $regex: cleanText(search), $options: "i" };
      query.$or = [
        { name: regex },
        { email: regex },
        { designation: regex },
        { department: regex },
        { skills: regex },
      ];
    }

    const [members, total, statusCounts, teamDepartments, userDepartments] = await Promise.all([
      TeamMemberModel.find(query)
        .populate({ path: "userID", select: "name email role avatar isActive isVerified profile.department createdAt" })
        .sort({ order: 1, createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .lean(),
      TeamMemberModel.countDocuments(query),
      TeamMemberModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      TeamMemberModel.distinct("department", { department: { $nin: [null, ""] } }),
      Auth.distinct("profile.department", { "profile.department": { $nin: [null, ""] } }),
    ]);

    return res.status(200).json({
      success: true,
      message: members.length ? "Team members fetched successfully" : "No team members found",
      data: members,
      counts: statusCounts.map((item) => ({
        label: item._id || "unknown",
        value: item.count,
      })),
      departments: [...new Set([...teamDepartments, ...userDepartments].map(cleanText).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    return handleTeamError(error, res);
  }
};

export const getPublicTeamMembers = async (req, res) => {
  try {
    const { department, featured } = req.query;
    const query = { status: "active" };

    if (department) query.department = { $regex: cleanText(department), $options: "i" };
    if (featured === "true") query.isFeatured = true;

    const members = await TeamMemberModel.find(query)
      .select("name slug designation department bio avatar skills socialLinks order isFeatured")
      .sort({ order: 1, isFeatured: -1, createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: members.length ? "Team members fetched successfully" : "No team members found",
      data: members,
    });
  } catch (error) {
    return handleTeamError(error, res);
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!canManageTeam(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const payload = buildTeamPayload(req.body);
    const linkedAccount = await resolveLinkedAccount(payload.userID, payload.role, payload.department);
    delete payload.role;
    if (linkedAccount) {
      payload.userID = linkedAccount._id;
      if (!payload.email) payload.email = linkedAccount.email;
      if (!payload.avatar) payload.avatar = linkedAccount.avatar;
    }
    const member = await TeamMemberModel.create(payload);

    return res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: member,
    });
  } catch (error) {
    return handleTeamError(error, res);
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!canManageTeam(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const member = await TeamMemberModel.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    const payload = buildTeamPayload(req.body, { partial: true });
    const requestedUserID = payload.userID === undefined ? member.userID : payload.userID;
    const linkedAccount = await resolveLinkedAccount(requestedUserID, payload.role, payload.department);
    delete payload.role;
    if (linkedAccount) {
      payload.userID = linkedAccount._id;
      if (!payload.email) payload.email = linkedAccount.email;
      if (!payload.avatar) payload.avatar = linkedAccount.avatar;
    }
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) member[key] = value;
    });

    await member.save();

    const updatedMember = await TeamMemberModel.findById(member._id)
      .populate({ path: "userID", select: "name email role avatar isActive isVerified profile.department createdAt" })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    return handleTeamError(error, res);
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!canManageTeam(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const member = await TeamMemberModel.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    await member.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    return handleTeamError(error, res);
  }
};
