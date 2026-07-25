import { CommentModel } from "../../backend/src/models/blog/comment.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: CommentModel,
  resource: "comments",
  statusTool: true,
  searchFields: ["authorName", "postSlug", "comment"],
  filterFields: ["postSlug"],
  listProjection:
    "postID postSlug authorName website comment status likes createdAt updatedAt",
  writeExcludedPaths: ["ipHash", "userAgent"],
});
