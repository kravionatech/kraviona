import { MessageModel } from "../../backend/src/models/messages/message.model.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: MessageModel,
  resource: "messages",
  statusTool: true,
  searchFields: ["firstName", "lastName", "email", "subject", "message"],
  listProjection:
    "firstName lastName email phone subject status createdAt updatedAt",
});
