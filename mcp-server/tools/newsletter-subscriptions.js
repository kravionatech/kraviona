import { newsLatterModel } from "../../backend/src/models/newslatter/newslatter.model.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: newsLatterModel,
  resource: "newsletter_subscriptions",
  searchFields: ["email"],
  filterFields: ["status"],
});
