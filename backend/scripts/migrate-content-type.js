import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../.env.production") });

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kraviona";

async function runMigration() {
  console.log("Connecting to MongoDB at:", mongoUri ? mongoUri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@") : "N/A");
  await mongoose.connect(mongoUri, { dbName: process.env.DB_NAME || "kraviona" });
  console.log("Connected to database:", mongoose.connection.name);

  const postsCollection = mongoose.connection.collection("posts");
  const categoriesCollection = mongoose.connection.collection("categories");

  const postFilter = {
    $or: [
      { contentType: { $exists: false } },
      { contentType: null },
      { contentType: "" },
    ],
  };

  const categoryFilter = {
    $or: [
      { contentType: { $exists: false } },
      { contentType: null },
      { contentType: "" },
    ],
  };

  const postsBefore = await postsCollection.countDocuments(postFilter);
  const categoriesBefore = await categoriesCollection.countDocuments(categoryFilter);

  console.log(`Found ${postsBefore} posts needing contentType migration.`);
  console.log(`Found ${categoriesBefore} categories needing contentType migration.`);

  if (postsBefore > 0) {
    const postRes = await postsCollection.updateMany(postFilter, {
      $set: { contentType: "blog" },
    });
    console.log(`Updated ${postRes.modifiedCount} posts to contentType: 'blog'.`);
  }

  if (categoriesBefore > 0) {
    const catRes = await categoriesCollection.updateMany(categoryFilter, {
      $set: { contentType: "blog" },
    });
    console.log(`Updated ${catRes.modifiedCount} categories to contentType: 'blog'.`);
  }

  console.log("Migration completed successfully!");
  await mongoose.disconnect();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
