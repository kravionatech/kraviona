import { CategoryModel } from "../../backend/src/models/blog/category.model.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: CategoryModel,
  resource: "categories",
  lookup: "slug",
  searchFields: ["name", "description", "metaTitle", "metaDescription"],
  filterFields: ["status"],
  listProjection:
    "name slug description image status postCount metaTitle metaDescription createdAt updatedAt",
});
