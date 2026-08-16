import slugify from "slugify";
import { Service } from "../../models/services/service.model.js";
import { recordActivity } from "../../utils/activityLogger.js";
import { publicServices } from "../../data/publicCatalog.js";
import { mergeNestedFields, parseBoolean } from "../../utils/requestValues.js";

const canManageServices = (user) => ["super_admin", "admin", "editor"].includes(user?.role);
const canManageAllServices = (user) => user?.role === "super_admin";
const cleanText = (value) => String(value || "").trim();
const getList = (items) => Array.isArray(items) ? items.map(cleanText).filter(Boolean) : [];
const getContentItems = (items) => Array.isArray(items)
  ? items.map((item) => ({ title: cleanText(item?.title), description: cleanText(item?.description) })).filter((item) => item.title || item.description)
  : [];
const getFaqs = (items) => Array.isArray(items)
  ? items.map((item) => ({ question: cleanText(item?.question), answer: cleanText(item?.answer) })).filter((item) => item.question && item.answer)
  : [];
const safeLink = (value, fallback = "") => {
  const link = cleanText(value);
  if (!link) return fallback;
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(link) ? link : fallback;
};
const normalize = (body) => ({
  title: cleanText(body.title),
  slug: slugify(cleanText(body.slug || body.title), { lower: true, strict: true }),
  category: cleanText(body.category) || "General",
  description: cleanText(body.description),
  features: getList(body.features),
  hero: {
    eyebrow: cleanText(body.hero?.eyebrow) || cleanText(body.category) || "Professional Service",
    title: cleanText(body.hero?.title) || cleanText(body.title),
    highlight: cleanText(body.hero?.highlight) || "Services",
    description: cleanText(body.hero?.description) || cleanText(body.description),
  },
  intro: cleanText(body.intro) || cleanText(body.description),
  outcomes: getContentItems(body.outcomes),
  trustPoints: getContentItems(body.trustPoints),
  deliverables: getList(body.deliverables),
  idealFor: getList(body.idealFor),
  successMetrics: getList(body.successMetrics),
  process: getContentItems(body.process),
  techStack: getList(body.techStack),
  faqs: getFaqs(body.faqs),
  cta: {
    title: cleanText(body.cta?.title) || `Ready to start your ${cleanText(body.title)} project?`,
    description: cleanText(body.cta?.description),
    label: cleanText(body.cta?.label) || "Discuss Your Project",
    href: safeLink(body.cta?.href, "/contact"),
  },
  seo: {
    metaTitle: cleanText(body.seo?.metaTitle),
    metaDescription: cleanText(body.seo?.metaDescription),
    keywords: getList(body.seo?.keywords),
    ogImage: safeLink(body.seo?.ogImage),
    noIndex: parseBoolean(body.seo?.noIndex, false),
  },
  expert: {
    name: cleanText(body.expert?.name),
    jobTitle: cleanText(body.expert?.jobTitle),
    bio: cleanText(body.expert?.bio),
    image: safeLink(body.expert?.image),
    email: cleanText(body.expert?.email).toLowerCase(),
    phone: cleanText(body.expert?.phone),
    whatsapp: safeLink(body.expert?.whatsapp),
    linkedin: safeLink(body.expert?.linkedin),
    companyLinkedin: safeLink(body.expert?.companyLinkedin),
    twitter: safeLink(body.expert?.twitter),
    facebook: safeLink(body.expert?.facebook),
    website: safeLink(body.expert?.website),
    address: cleanText(body.expert?.address),
    availability: cleanText(body.expert?.availability),
    consultation: cleanText(body.expert?.consultation),
    responseTime: cleanText(body.expert?.responseTime),
    expertise: getList(body.expert?.expertise),
    credentials: getList(body.expert?.credentials),
  },
  isFeatured: parseBoolean(body.isFeatured, false),
  isActive: parseBoolean(body.isActive, true),
  order: Number(body.order) || 0,
});

export const getPublicServices = async (_req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    const data = services.length ? services : publicServices.map((service, index) => ({ _id: `default-${index + 1}`, ...service }));
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Unable to fetch services" });
  }
};

export const getPublicServiceBySlug = async (req, res) => {
  try {
    const slug = slugify(cleanText(req.params.slug), { lower: true, strict: true });
    const service = await Service.findOne({ slug, isActive: true }).lean();
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Unable to fetch service" });
  }
};

export const getServices = async (req, res) => {
  if (!canManageServices(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
  const scope = canManageAllServices(req.user) ? {} : { createdBy: req.user.id };
  const indexability = cleanText(req.query.indexability).toLowerCase();
  const filter = { ...scope };
  if (indexability === "noindex") filter["seo.noIndex"] = true;
  if (indexability === "indexed") filter["seo.noIndex"] = { $ne: true };
  const [data, noIndex, indexed] = await Promise.all([
    Service.find(filter).sort({ order: 1, createdAt: -1 }).lean(),
    Service.countDocuments({ ...scope, "seo.noIndex": true }),
    Service.countDocuments({ ...scope, "seo.noIndex": { $ne: true } }),
  ]);
  return res.status(200).json({ success: true, message: data.length ? "Services fetched" : "No data found.", data, indexabilityCounts: { noIndex, indexed } });
};

export const createService = async (req, res) => {
  try {
    if (!canManageServices(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
    const data = normalize(req.body);
    if (!data.title || !data.description) return res.status(400).json({ success: false, message: "Title and description are required" });
    const service = await Service.create({ ...data, createdBy: req.user.id });
    await recordActivity(req, { userID: req.user.id, module: "service", action: "created", resourceId: service._id, resourceName: service.title, after: { title: service.title, isActive: service.isActive } });
    return res.status(201).json({ success: true, message: "Service created", data: service });
  } catch (error) {
    return res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "A service with this slug already exists" : error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    if (!canManageServices(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
    const service = await Service.findOne(canManageAllServices(req.user) ? { _id: req.params.id } : { _id: req.params.id, createdBy: req.user.id });
    if (!service) return res.status(404).json({ success: false, message: "No data found." });
    const before = { title: service.title, slug: service.slug, isActive: service.isActive };
    const merged = mergeNestedFields(service.toObject(), req.body, ["hero", "cta", "seo", "expert"]);
    Object.assign(service, normalize(merged));
    await service.save();
    await recordActivity(req, { userID: req.user.id, module: "service", action: "updated", resourceId: service._id, resourceName: service.title, before, after: { title: service.title, slug: service.slug, isActive: service.isActive } });
    return res.status(200).json({ success: true, message: "Service updated", data: service });
  } catch (error) {
    return res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "A service with this slug already exists" : error.message });
  }
};

export const deleteService = async (req, res) => {
  if (!canManageServices(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
  const service = await Service.findOneAndDelete(canManageAllServices(req.user) ? { _id: req.params.id } : { _id: req.params.id, createdBy: req.user.id });
  if (!service) return res.status(404).json({ success: false, message: "No data found." });
  await recordActivity(req, { userID: req.user.id, module: "service", action: "deleted", resourceId: service._id, resourceName: service.title, before: { title: service.title, slug: service.slug } });
  return res.status(200).json({ success: true, message: "Service deleted" });
};
