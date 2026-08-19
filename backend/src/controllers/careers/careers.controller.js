import slugify from "slugify";
import {
  CAREER_STATUS,
  CareerModel,
  EMPLOYMENT_TYPES,
  WORKPLACE_TYPES,
} from "../../models/Careers/career.model.js";
import { recordActivity } from "../../utils/activityLogger.js";
import { mergeNestedFields, parseBoolean } from "../../utils/requestValues.js";

const MANAGER_ROLES = new Set(["super_admin", "admin", "editor"]);
const canManage = (user) => MANAGER_ROLES.has(user?.role);
const canManageAll = (user) => user?.role === "super_admin";
const text = (value) => String(value ?? "").trim();
const list = (value) =>
  Array.isArray(value) ? value.map(text).filter(Boolean) : [];
const nullableNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
};
const nullableDate = (value) => (value ? new Date(value) : null);
const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const careerSnapshot = (career) => ({
  jobTitle: career.jobTitle,
  slug: career.slug,
  status: career.status,
  department: career.department,
  workplaceType: career.workplaceType,
  isFeatured: career.isFeatured,
});

const handleError = (error, response) => {
  if (error?.name === "ValidationError") {
    const errors = Object.values(error.errors).map((entry) => entry.message);
    return response.status(400).json({
      success: false,
      message: errors[0] || "Career validation failed",
      errors,
    });
  }
  if (error?.name === "CastError") {
    return response
      .status(400)
      .json({ success: false, message: "Invalid career identifier" });
  }
  if (error?.code === 11000) {
    return response.status(409).json({
      success: false,
      message: "A career with this slug already exists",
    });
  }
  return response.status(500).json({
    success: false,
    message: error?.message || "Unable to process career request",
  });
};

export const buildCareerPayload = (body = {}) => ({
  jobTitle: text(body.jobTitle),
  ...(text(body.slug)
    ? {
        slug: slugify(text(body.slug), {
          lower: true,
          strict: true,
          trim: true,
        }),
      }
    : {}),
  summary: text(body.summary),
  content: text(body.content),
  department: text(body.department) || "General",
  employmentType: EMPLOYMENT_TYPES.includes(body.employmentType)
    ? body.employmentType
    : "full-time",
  workplaceType: WORKPLACE_TYPES.includes(body.workplaceType)
    ? body.workplaceType
    : "on-site",
  location: {
    country: text(body.location?.country) || "India",
    state: text(body.location?.state),
    city: text(body.location?.city),
    address: text(body.location?.address),
    postalCode: text(body.location?.postalCode),
  },
  experience: {
    minimumYears: nullableNumber(body.experience?.minimumYears) ?? 0,
    maximumYears: nullableNumber(body.experience?.maximumYears),
    level: text(body.experience?.level) || "mid",
  },
  compensation: {
    minimum: nullableNumber(body.compensation?.minimum),
    maximum: nullableNumber(body.compensation?.maximum),
    currency: text(body.compensation?.currency).toUpperCase() || "INR",
    period: text(body.compensation?.period) || "year",
    isDisclosed: parseBoolean(body.compensation?.isDisclosed, false),
    notes: text(body.compensation?.notes),
  },
  responsibilities: list(body.responsibilities),
  requirements: list(body.requirements),
  preferredQualifications: list(body.preferredQualifications),
  skills: list(body.skills),
  benefits: list(body.benefits),
  openings: nullableNumber(body.openings) ?? 1,
  application: {
    email: text(body.application?.email).toLowerCase(),
    url: text(body.application?.url),
    deadline: nullableDate(body.application?.deadline),
    instructions: text(body.application?.instructions),
  },
  status: CAREER_STATUS.includes(body.status) ? body.status : "draft",
  isFeatured: parseBoolean(body.isFeatured, false),
  sortOrder: nullableNumber(body.sortOrder) ?? 0,
  seo: {
    metaTitle: text(body.seo?.metaTitle),
    metaDescription: text(body.seo?.metaDescription),
    keywords: list(body.seo?.keywords),
    canonicalUrl: text(body.seo?.canonicalUrl),
    noIndex: parseBoolean(body.seo?.noIndex, false),
  },
});

const publicAvailability = () => ({
  status: "published",
  isDeleted: { $ne: true },
  $and: [
    {
      $or: [
        { publishedAt: null },
        { publishedAt: { $exists: false } },
        { publishedAt: { $lte: new Date() } },
      ],
    },
    {
      $or: [
        { "application.deadline": null },
        { "application.deadline": { $exists: false } },
        { "application.deadline": { $gte: new Date() } },
      ],
    },
  ],
});

export const getPublicCareers = async (request, response) => {
  try {
    const page = Math.max(Number.parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(request.query.limit, 10) || 20, 1),
      50,
    );
    const query = publicAvailability();

    if (request.query.department) {
      query.department = new RegExp(
        `^${escapeRegex(text(request.query.department))}$`,
        "i",
      );
    }
    if (WORKPLACE_TYPES.includes(request.query.workplaceType)) {
      query.workplaceType = request.query.workplaceType;
    }
    if (EMPLOYMENT_TYPES.includes(request.query.employmentType)) {
      query.employmentType = request.query.employmentType;
    }
    if (text(request.query.search)) {
      const search = new RegExp(escapeRegex(text(request.query.search)), "i");
      query.$or = [
        { jobTitle: search },
        { summary: search },
        { department: search },
        { skills: search },
      ];
    }

    const [careers, total] = await Promise.all([
      CareerModel.find(query)
        .select(
          "jobTitle slug summary department employmentType workplaceType location experience compensation skills openings application.deadline isFeatured publishedAt createdAt updatedAt seo.noIndex",
        )
        .sort({ isFeatured: -1, sortOrder: 1, publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      CareerModel.countDocuments(query),
    ]);

    return response.status(200).json({
      success: true,
      count: careers.length,
      data: careers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    });
  } catch (error) {
    return handleError(error, response);
  }
};

export const getPublicCareerBySlug = async (request, response) => {
  try {
    const slug = slugify(text(request.params.slug), {
      lower: true,
      strict: true,
      trim: true,
    });
    const career = await CareerModel.findOne({
      ...publicAvailability(),
      slug,
    }).lean();

    if (!career) {
      return response
        .status(404)
        .json({ success: false, message: "Career opening not found" });
    }
    return response.status(200).json({ success: true, data: career });
  } catch (error) {
    return handleError(error, response);
  }
};

export const getAdminCareers = async (request, response) => {
  try {
    if (!canManage(request.user)) {
      return response
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    const page = Math.max(Number.parseInt(request.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(request.query.limit, 10) || 20, 1),
      50,
    );
    const scope = canManageAll(request.user)
      ? {}
      : { userID: request.user.id };
    const query = {
      ...scope,
      ...(request.query.includeDeleted === "true" ? {} : { isDeleted: false }),
    };

    if (CAREER_STATUS.includes(request.query.status)) {
      query.status = request.query.status;
    }
    if (text(request.query.search)) {
      const search = new RegExp(escapeRegex(text(request.query.search)), "i");
      query.$or = [
        { jobTitle: search },
        { slug: search },
        { department: search },
        { skills: search },
      ];
    }

    const [careers, total, statusCounts, departments] = await Promise.all([
      CareerModel.find(query)
        .populate({ path: "userID", select: "name email role" })
        .sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      CareerModel.countDocuments(query),
      CareerModel.aggregate([
        { $match: { ...scope, isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      CareerModel.distinct("department", { ...scope, isDeleted: false }),
    ]);

    return response.status(200).json({
      success: true,
      data: careers,
      counts: Object.fromEntries(
        CAREER_STATUS.map((status) => [
          status,
          statusCounts.find((entry) => entry._id === status)?.count || 0,
        ]),
      ),
      departments: departments.filter(Boolean).sort(),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleError(error, response);
  }
};

export const createCareer = async (request, response) => {
  try {
    if (!canManage(request.user)) {
      return response
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    const career = await CareerModel.create({
      ...buildCareerPayload(request.body),
      userID: request.user.id,
      updatedBy: request.user.id,
    });
    await recordActivity(request, {
      userID: request.user.id,
      module: "career",
      action: "created",
      resourceId: career._id,
      resourceName: career.jobTitle,
      after: careerSnapshot(career),
    });

    return response.status(201).json({
      success: true,
      message: "Career opening created",
      data: career,
    });
  } catch (error) {
    return handleError(error, response);
  }
};

export const updateCareer = async (request, response) => {
  try {
    if (!canManage(request.user)) {
      return response
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    const scope = canManageAll(request.user)
      ? { _id: request.params.id }
      : { _id: request.params.id, userID: request.user.id };
    const career = await CareerModel.findOne(scope);
    if (!career) {
      return response
        .status(404)
        .json({ success: false, message: "Career opening not found" });
    }

    const before = careerSnapshot(career);
    const merged = mergeNestedFields(career.toObject(), request.body, [
      "location",
      "experience",
      "compensation",
      "application",
      "seo",
    ]);
    Object.assign(career, buildCareerPayload(merged), {
      updatedBy: request.user.id,
    });
    await career.save();

    await recordActivity(request, {
      userID: request.user.id,
      module: "career",
      action: "updated",
      resourceId: career._id,
      resourceName: career.jobTitle,
      before,
      after: careerSnapshot(career),
    });

    return response.status(200).json({
      success: true,
      message: "Career opening updated",
      data: career,
    });
  } catch (error) {
    return handleError(error, response);
  }
};

export const deleteCareer = async (request, response) => {
  try {
    if (!canManage(request.user)) {
      return response
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    const scope = canManageAll(request.user)
      ? { _id: request.params.id, isDeleted: false }
      : {
          _id: request.params.id,
          userID: request.user.id,
          isDeleted: false,
        };
    const career = await CareerModel.findOne(scope);
    if (!career) {
      return response
        .status(404)
        .json({ success: false, message: "Career opening not found" });
    }

    const before = careerSnapshot(career);
    career.isDeleted = true;
    career.deletedAt = new Date();
    career.deletedBy = request.user.id;
    career.status = "archived";
    career.updatedBy = request.user.id;
    await career.save();

    await recordActivity(request, {
      userID: request.user.id,
      module: "career",
      action: "deleted",
      resourceId: career._id,
      resourceName: career.jobTitle,
      before,
      after: careerSnapshot(career),
    });

    return response.status(200).json({
      success: true,
      message: "Career opening archived",
    });
  } catch (error) {
    return handleError(error, response);
  }
};
