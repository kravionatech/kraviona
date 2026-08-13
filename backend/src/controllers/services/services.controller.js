import slugify from "slugify";
import { Service } from "../../models/services/service.model.js";
import { publicServices } from "../../data/publicCatalog.js";

const canManageServices = (user) => ["admin", "super_admin"].includes(user?.role);
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
  const data = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
  return res.status(200).json({ success: true, message: data.length ? "Services fetched" : "No data found.", data });
};

export const createService = async (req, res) => {
  try {
    if (!canManageServices(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
    const data = normalize(req.body);
    if (!data.title || !data.description) return res.status(400).json({ success: false, message: "Title and description are required" });
    const service = await Service.create(data);
    return res.status(201).json({ success: true, message: "Service created", data: service });
  } catch (error) {
    return res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "A service with this slug already exists" : error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    if (!canManageServices(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "No data found." });
    Object.assign(service, normalize({ ...service.toObject(), ...req.body }));
    await service.save();
    return res.status(200).json({ success: true, message: "Service updated", data: service });
  } catch (error) {
    return res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "A service with this slug already exists" : error.message });
  }
};

export const deleteService = async (req, res) => {
  if (!canManageServices(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: "No data found." });
  return res.status(200).json({ success: true, message: "Service deleted" });
};
