import { TeamMemberModel } from "../../backend/src/models/team/team.model.js";
import { createResourceTools } from "./resource.js";

export const { tools, handle } = createResourceTools({
  model: TeamMemberModel,
  resource: "team_members",
  lookup: "slug",
  searchFields: ["name", "designation", "department", "bio", "skills"],
  filterFields: ["status", "department", "isFeatured"],
  listProjection:
    "name slug email phone designation department avatar skills socialLinks order isFeatured status createdAt updatedAt",
});
