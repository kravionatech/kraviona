import { PostModel } from "../../backend/src/models/blog/post.model.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: PostModel,
  resource: "posts",
  lookup: "slug",
  searchFields: [
    "title",
    "excerpt",
    "content",
    "tags",
    "keywords",
    "focusKeywords",
  ],
  filterFields: ["status", "categoryID", "language", "contentSourceType"],
  listProjection:
    "title slug excerpt quickAnswer tags wordCount readingTimeMinutes author category featuredImage status publishedAt scheduledAt language contentSourceType createdAt updatedAt",
});
