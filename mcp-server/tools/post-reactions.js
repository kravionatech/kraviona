import { PostReactionModel } from "../../backend/src/models/blog/reaction.model.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: PostReactionModel,
  resource: "post_reactions",
  searchFields: ["postSlug", "visitorId", "shareChannel"],
  filterFields: ["type", "postSlug"],
  writeExcludedPaths: ["ipHash", "userAgent"],
});
