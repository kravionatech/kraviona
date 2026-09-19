import mongoose from "mongoose";
import { Auth } from "./src/models/auth/auth.models.js";
import connectDB from "./src/config/db.js";

async function checkUsers() {
  await connectDB();
  const users = await Auth.find().select("_id name email username role").lean();
  console.log("Current users in DB:", users);
  process.exit(0);
}

checkUsers();
