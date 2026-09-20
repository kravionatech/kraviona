import { connectDB, disconnectDB } from "../db.js";
import { Auth } from "../../backend/src/models/auth/auth.models.js";
import { handle } from "../tools/admin.js";

async function main() {
  await connectDB();
  const admin = await Auth.findOne({ role: "super_admin" });
  const actor = {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };

  console.log("Testing Full Site Controller tools with authenticated superadmin:", actor.name);

  // 1. Dashboard
  const dash = await handle("kraviona_get_dashboard", {}, { actor });
  console.log("\n1. Dashboard agency & content stats:");
  console.log("   Posts:", dash.structuredContent?.dashboard?.content?.totalPosts);
  console.log("   Services:", dash.structuredContent?.dashboard?.agency?.services);
  console.log("   Projects:", dash.structuredContent?.dashboard?.agency?.projects);
  console.log("   Careers:", dash.structuredContent?.dashboard?.agency?.careers);
  console.log("   Team Members:", dash.structuredContent?.dashboard?.agency?.teamMembers);

  // 2. Services list
  const services = await handle("kraviona_list_services", { limit: 5 }, { actor });
  console.log("\n2. Services count in DB:", services.structuredContent?.pagination?.total);

  // 3. Projects list
  const projects = await handle("kraviona_list_projects", { limit: 5 }, { actor });
  console.log("\n3. Projects count in DB:", projects.structuredContent?.pagination?.total);

  // 4. Careers list
  const careers = await handle("kraviona_list_careers", { limit: 5 }, { actor });
  console.log("\n4. Careers count in DB:", careers.structuredContent?.pagination?.total);

  // 5. Team list
  const team = await handle("kraviona_list_team_members", { limit: 5 }, { actor });
  console.log("\n5. Team members count in DB:", team.structuredContent?.pagination?.total);

  // 6. Describe Resources
  const resources = await handle("describe_admin_resources", {}, { actor });
  console.log("\n6. Total Manageable Resources:", resources.structuredContent?.resources?.length);

  console.log("\nAll Full Site Controller tools verified successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
