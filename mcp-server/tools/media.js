import { mediaModel } from "../../backend/src/models/media/media.model.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: mediaModel,
  resource: "media",
  singular: "media_item",
  searchFields: ["fileName", "originalName", "altText"],
  filterFields: ["mediaType", "isDeleted"],
});
