import { SiteSettingModel } from "../../models/settings/siteSettings.model.js";

// Allowed setting keys — whitelist to prevent arbitrary key creation
const ALLOWED_KEYS = [
  "headerCode",   // HTML/script injected into <head>
  "bodyCode",     // HTML/script injected right after <body> open
  "footerCode",   // HTML/script injected right before </body>
  "robotsOverride", // Full custom robots.txt content
  "llmsOverride",   // Full custom LLMs.txt content
  "seoSettings",    // Global SEO metadata defaults
  "sitemapSettings",// Sitemap custom inclusions/exclusions
];

// ─── GET /public/settings/code-injection ────────────────────────────────────
// Public endpoint — the frontend layout reads this at ISR/build time.
// Only returns code injection keys (never robots/llms overrides).
export const getCodeInjection = async (req, res) => {
  try {
    const keys = ["headerCode", "bodyCode", "footerCode"];
    const settings = await SiteSettingModel.find({ key: { $in: keys } })
      .select("key value")
      .lean();

    const result = { headerCode: "", bodyCode: "", footerCode: "" };
    settings.forEach((s) => { result[s.key] = s.value || ""; });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /admin/settings/:key ────────────────────────────────────────────────
// Authenticated: any admin role can read a setting.
export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ success: false, message: "Invalid setting key" });
    }

    const setting = await SiteSettingModel.findOne({ key }).select("key value updatedAt").lean();
    return res.status(200).json({
      success: true,
      data: { key, value: setting?.value ?? null, updatedAt: setting?.updatedAt ?? null },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /admin/settings/:key ────────────────────────────────────────────────
// super_admin only.
export const updateSetting = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (user.role !== "super_admin") {
      return res.status(403).json({ success: false, message: "Only super admin can update settings" });
    }

    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ success: false, message: "Invalid setting key" });
    }

    const { value } = req.body;
    const setting = await SiteSettingModel.findOneAndUpdate(
      { key },
      { $set: { value, updatedBy: user.id } },
      { new: true, upsert: true, runValidators: true }
    ).select("key value updatedAt");

    return res.status(200).json({ success: true, message: "Setting updated", data: setting });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
