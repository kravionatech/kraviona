import Lead from "../../backend/src/models/leads/lead.model.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: Lead,
  resource: "leads",
  statusTool: true,
  searchFields: [
    "name",
    "email",
    "phone",
    "company",
    "subject",
    "service",
    "tags",
  ],
  filterFields: ["source", "isArchived", "assignedTo"],
  listProjection:
    "name email phone company designation subject leadType service budget status source score dealValue currency expectedCloseDate assignedTo tags isArchived createdAt updatedAt",
});
