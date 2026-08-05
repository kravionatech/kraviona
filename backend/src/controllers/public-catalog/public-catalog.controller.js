import { publicProjects, publicServices } from "../../data/publicCatalog.js";

const withIds = (items, prefix) =>
  items.map((item, index) => ({
    _id: `${prefix}-${index + 1}`,
    ...item,
  }));

export const getPublicServices = (_req, res) => {
  res.status(200).json({
    success: true,
    count: publicServices.length,
    data: withIds(publicServices, "service"),
  });
};

export const getPublicProjects = (_req, res) => {
  res.status(200).json({
    success: true,
    count: publicProjects.length,
    data: withIds(publicProjects, "project"),
  });
};
