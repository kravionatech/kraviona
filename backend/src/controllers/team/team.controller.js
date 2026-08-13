import slugify from "slugify";
import { TeamMemberModel } from "../../models/team/team.model.js";
import { Auth } from "../../models/auth/auth.models.js";

const MANAGER_ROLES = ["super_admin"];
const TEAM_STATUSES = ["active", "inactive"];
const USER_ROLES = ["super_admin", "admin", "editor", "viewer", "user"];

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

const buildTeamPayload = (body) => ({
  name: cleanText(body.name),
  slug: body.slug ? slugify(cleanText(body.slug), { lower: true, strict: true }) : undefined,
  email: body.email ? cleanText(body.email).toLowerCase() : undefined,
  phone: cleanText(body.phone),
  designation: cleanText(body.designation),
  department: cleanText(body.department) || "General",
  bio: cleanText(body.bio),
  avatar: cleanText(body.avatar),
  skills: normalizeArray(body.skills),
  socialLinks: normalizeSocialLinks(body.socialLinks),
  userID: body.userID === "" ? null : body.userID || undefined,
  role: body.role || undefined,
  order: Number(body.order || 0),
  isFeatured: Boolean(body.isFeatured),
  status: TEAM_STATUSES.includes(body.status) ? body.status : "active",
});

const resolveLinkedAccount = async (userID, role) => {
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
  if (role && account.role !== role) {
    account.role = role;
    await account.save();
  }
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

    const [members, total, statusCounts] = await Promise.all([
      TeamMemberModel.find(query)
        .populate({ path: "userID", select: "name email role avatar isActive isVerified createdAt" })
        .sort({ order: 1, createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .lean(),
      TeamMemberModel.countDocuments(query),
      TeamMemberModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      message: members.length ? "Team members fetched successfully" : "No team members found",
      data: members,
      counts: statusCounts.map((item) => ({
        label: item._id || "unknown",
        value: item.count,
      })),
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
    const linkedAccount = await resolveLinkedAccount(payload.userID, payload.role);
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

    const payload = buildTeamPayload(req.body);
    const requestedUserID = payload.userID === undefined ? member.userID : payload.userID;
    const linkedAccount = await resolveLinkedAccount(requestedUserID, payload.role);
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
      .populate({ path: "userID", select: "name email role avatar isActive isVerified createdAt" })
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
