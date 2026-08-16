import bcrypt from "bcryptjs";
import slugify from "slugify";
import { Auth } from "../../models/auth/auth.models.js";
import { TeamMemberModel } from "../../models/team/team.model.js";
import { hasOwn, parseBoolean } from "../../utils/requestValues.js";

const USER_ROLES = ["super_admin", "admin", "editor", "viewer", "user"];
const TEAM_ACCOUNT_ROLES = ["super_admin", "admin", "editor"];
const MANAGER_ROLES = ["super_admin"];

const canManageUsers = (user) => user && MANAGER_ROLES.includes(user.role);
const isSuperAdmin = (user) => user?.role === "super_admin";

const cleanText = (value) => String(value || "").trim();

const roleLabel = (role) =>
  role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

// Staff accounts appear in the team directory automatically. The relation is
// intentionally one-way: a standalone team profile does not need a login.
const syncStaffAccountToTeam = async (account) => {
  if (!account) return null;

  if (!TEAM_ACCOUNT_ROLES.includes(account.role)) {
    await TeamMemberModel.updateOne(
      { userID: account._id },
      { $unset: { userID: 1 } },
    );
    return null;
  }

  const email = cleanText(account.email).toLowerCase();
  let member = await TeamMemberModel.findOne({ userID: account._id });
  if (!member && email) {
    member = await TeamMemberModel.findOne({
      email,
      $or: [{ userID: { $exists: false } }, { userID: null }],
    });
  }

  if (!member) {
    member = new TeamMemberModel({
      slug: `${slugify(account.name, { lower: true, strict: true }) || "team-member"}-${String(account._id).slice(-8)}`,
      designation: cleanText(account.profile?.jobTitle) || roleLabel(account.role),
      department: cleanText(account.profile?.department) || (account.role === "editor" ? "Content" : "Administration"),
      skills: [],
      order: 0,
      isFeatured: false,
    });
  }

  member.userID = account._id;
  member.name = cleanText(account.name);
  member.email = email || undefined;
  member.phone = cleanText(account.phone);
  member.avatar = cleanText(account.avatar);
  member.bio = cleanText(account.profile?.bio);
  member.designation = cleanText(account.profile?.jobTitle) || member.designation || roleLabel(account.role);
  member.department = cleanText(account.profile?.department) || member.department || "General";
  member.status = account.isActive ? "active" : "inactive";
  await member.save();
  return member;
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const object = typeof user.toObject === "function" ? user.toObject() : user;
  delete object.password;
  delete object.loginAttempts;
  delete object.lockUntil;
  delete object.passwordResetToken;
  delete object.passwordResetExpires;
  return object;
};

const handleUserError = (error, res) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Unable to process users request",
  });
};

const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return "Password must contain uppercase, lowercase, number and special character";
  }

  return "";
};

export const getAllUsers = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!canManageUsers(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { role, status, search, page = 1, limit = 20 } = req.query;
    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const perPage = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 50);
    const query = {};

    if (role && USER_ROLES.includes(role)) query.role = role;
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    if (search) {
      const regex = { $regex: cleanText(search), $options: "i" };
      query.$or = [
        { name: regex },
        { email: regex },
        { username: regex },
        { phone: regex },
        { "profile.jobTitle": regex },
        { "profile.department": regex },
      ];
    }

    const [users, total, roleCounts, userDepartments, teamDepartments] = await Promise.all([
      Auth.find(query)
        .select("-password -loginAttempts -lockUntil -passwordResetToken -passwordResetExpires")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .lean(),
      Auth.countDocuments(query),
      Auth.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Auth.distinct("profile.department", { "profile.department": { $nin: [null, ""] } }),
      TeamMemberModel.distinct("department", { department: { $nin: [null, ""] } }),
    ]);

    const teamMembers = await TeamMemberModel.find({ userID: { $in: users.map((item) => item._id) } })
      .select("name designation department avatar status userID")
      .lean();
    const teamMemberByUser = new Map(teamMembers.map((item) => [String(item.userID), item]));

    return res.status(200).json({
      success: true,
      message: users.length ? "Users fetched successfully" : "No users found",
      data: users.map((item) => ({ ...item, teamMember: teamMemberByUser.get(String(item._id)) || null })),
      counts: roleCounts.map((item) => ({
        label: item._id || "unknown",
        value: item.count,
      })),
      departments: [...new Set([...userDepartments, ...teamDepartments].map(cleanText).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    return handleUserError(error, res);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!canManageUsers(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const {
      name,
      email,
      username,
      phone,
      password,
      role = "user",
      avatar,
      isActive = true,
      isVerified = true,
      profile = {},
      preferences = {},
    } = req.body;

    if (!USER_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (role === "super_admin" && !isSuperAdmin(user)) {
      return res.status(403).json({
        success: false,
        message: "Only super admin can create a super admin",
      });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await Auth.create({
      name: cleanText(name),
      email: cleanText(email).toLowerCase(),
      username: cleanText(username),
      phone: cleanText(phone),
      password: hashedPassword,
      role,
      avatar: avatar ? cleanText(avatar) : undefined,
      isActive: parseBoolean(isActive, true),
      isVerified: parseBoolean(isVerified, true),
      profile: {
        bio: cleanText(profile.bio),
        jobTitle: cleanText(profile.jobTitle),
        department: cleanText(profile.department) || "General",
        socialLinks: Array.isArray(profile.socialLinks) ? profile.socialLinks : [],
      },
      preferences: {
        theme: preferences.theme || "dark",
        emailNotifications: preferences.emailNotifications ?? true,
      },
    });

    try {
      await syncStaffAccountToTeam(createdUser);
    } catch (syncError) {
      await Auth.deleteOne({ _id: createdUser._id });
      throw syncError;
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: sanitizeUser(createdUser),
    });
  } catch (error) {
    return handleUserError(error, res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!canManageUsers(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const targetUser = await Auth.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (targetUser.role === "super_admin" && !isSuperAdmin(user)) {
      return res.status(403).json({
        success: false,
        message: "Only super admin can update a super admin",
      });
    }

    const allowedFields = ["name", "email", "username", "phone", "avatar"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        targetUser[field] =
          field === "email" ? cleanText(req.body[field]).toLowerCase() : cleanText(req.body[field]);
      }
    }

    if (req.body.role !== undefined) {
      if (!USER_ROLES.includes(req.body.role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
      }

      if (req.body.role === "super_admin" && !isSuperAdmin(user)) {
        return res.status(403).json({
          success: false,
          message: "Only super admin can assign super admin role",
        });
      }

      targetUser.role = req.body.role;
    }

    if (req.body.isActive !== undefined) {
      targetUser.isActive = parseBoolean(req.body.isActive, targetUser.isActive);
    }

    if (req.body.isVerified !== undefined) {
      targetUser.isVerified = parseBoolean(req.body.isVerified, targetUser.isVerified);
    }

    if (req.body.profile) {
      const profileInput = req.body.profile;
      const profile = targetUser.profile?.toObject?.() || targetUser.profile || {};
      if (hasOwn(profileInput, "bio")) profile.bio = cleanText(profileInput.bio);
      if (hasOwn(profileInput, "jobTitle")) profile.jobTitle = cleanText(profileInput.jobTitle);
      if (hasOwn(profileInput, "department")) {
        profile.department = cleanText(profileInput.department) || "General";
      }
      if (hasOwn(profileInput, "socialLinks")) {
        profile.socialLinks = Array.isArray(profileInput.socialLinks) ? profileInput.socialLinks : [];
      }
      targetUser.profile = profile;
    }

    if (req.body.preferences) {
      targetUser.preferences = {
        ...(targetUser.preferences?.toObject?.() || targetUser.preferences || {}),
        ...req.body.preferences,
      };
    }

    if (req.body.password) {
      const passwordError = validatePassword(req.body.password);
      if (passwordError) {
        return res.status(400).json({ success: false, message: passwordError });
      }
      targetUser.password = await bcrypt.hash(req.body.password, 12);
    }

    await targetUser.save();
    await syncStaffAccountToTeam(targetUser);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: sanitizeUser(targetUser),
    });
  } catch (error) {
    return handleUserError(error, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!canManageUsers(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (String(user.id) === String(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const targetUser = await Auth.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (targetUser.role === "super_admin" && !isSuperAdmin(user)) {
      return res.status(403).json({
        success: false,
        message: "Only super admin can delete a super admin",
      });
    }

    await TeamMemberModel.updateOne(
      { userID: targetUser._id },
      { $unset: { userID: 1 } },
    );
    await targetUser.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return handleUserError(error, res);
  }
};
