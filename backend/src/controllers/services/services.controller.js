import slugify from "slugify";
import { Service } from "../../models/services/service.model.js";
import { recordActivity } from "../../utils/activityLogger.js";
import { publicServices } from "../../data/publicCatalog.js";

const canManageServices = (user) => ["super_admin", "admin", "editor"].includes(user?.role);
const canManageAllServices = (user) => user?.role === "super_admin";
const cleanText = (value) => String(value || "").trim();
const getFeatures = (features) => Array.isArray(features) ? features.map(cleanText).filter(Boolean) : [];
const normalize = (body) => ({
  title: cleanText(body.title),
  slug: slugify(cleanText(body.slug || body.title), { lower: true, strict: true }),
  category: cleanText(body.category) || "General",
  description: cleanText(body.description),
  features: getFeatures(body.features),
  isActive: body.isActive !== false,
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

export const getServices = async (req, res) => {
  if (!canManageServices(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
  const data = await Service.find(canManageAllServices(req.user) ? {} : { createdBy: req.user.id }).sort({ order: 1, createdAt: -1 }).lean();
  return res.status(200).json({ success: true, message: data.length ? "Services fetched" : "No data found.", data });
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
    Object.assign(service, normalize({ ...service.toObject(), ...req.body }));
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
