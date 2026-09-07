import { RedirectModel } from "../../models/settings/redirect.model.js";

// ─── GET /public/redirects ───────────────────────────────────────────────────
// Public endpoint — the Next.js middleware fetches this to apply redirects.
// Only returns active redirects; intentionally lightweight (source/destination/type only).
export const getPublicRedirects = async (req, res) => {
  try {
    const redirects = await RedirectModel.find({ active: true })
      .select("source destination type")
      .lean();
    return res.status(200).json({ success: true, data: redirects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /admin/redirects ────────────────────────────────────────────────────
export const getRedirects = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!["super_admin", "admin"].includes(user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { page = 1, limit = 50, search } = req.query;
    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const perPage = Math.min(Math.max(Number.parseInt(limit, 10) || 50, 1), 200);
    const query = {};
    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [{ source: regex }, { destination: regex }];
    }

    const [redirects, total] = await Promise.all([
      RedirectModel.find(query)
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage),
      RedirectModel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: redirects,
      pagination: { total, page: currentPage, limit: perPage, totalPages: Math.ceil(total / perPage) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /admin/redirects ───────────────────────────────────────────────────
export const createRedirect = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!["super_admin", "admin"].includes(user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { source, destination, type = "301", active = true } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ success: false, message: "source and destination are required" });
    }
    if (!source.startsWith("/")) {
      return res.status(400).json({ success: false, message: "source must start with /" });
    }

    const cleanSource = source.trim();
    const cleanDestination = destination.trim();

    if (cleanSource === cleanDestination) {
      return res.status(400).json({
        success: false,
        message: "Source and destination cannot be identical (would cause an infinite redirect loop)",
      });
    }

    const existing = await RedirectModel.findOne({ source: cleanSource });
    if (existing) {
      return res.status(409).json({ success: false, message: "A redirect for this source already exists" });
    }

    // Check if destination is already a source for another redirect (chain prevention)
    const wouldChain = await RedirectModel.findOne({ source: cleanDestination });
    if (wouldChain) {
      return res.status(400).json({
        success: false,
        message: `Destination '${cleanDestination}' is already being redirected to '${wouldChain.destination}'. Redirect directly to '${wouldChain.destination}' to avoid redirect chains.`,
      });
    }

    const redirect = new RedirectModel({
      source: cleanSource,
      destination: cleanDestination,
      type: ["301", "302"].includes(String(type)) ? String(type) : "301",
      active: Boolean(active),
    });
    await redirect.save();

    return res.status(201).json({ success: true, message: "Redirect created", data: redirect });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /admin/redirects/:id ────────────────────────────────────────────────
export const updateRedirect = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!["super_admin", "admin"].includes(user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;
    const { source, destination, type, active } = req.body;
    const existing = await RedirectModel.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Redirect not found" });

    const newSource = source !== undefined ? source.trim() : existing.source;
    const newDest = destination !== undefined ? destination.trim() : existing.destination;

    if (newSource === newDest) {
      return res.status(400).json({
        success: false,
        message: "Source and destination cannot be identical (would cause an infinite redirect loop)",
      });
    }

    if (source !== undefined && newSource !== existing.source) {
      const conflict = await RedirectModel.findOne({ source: newSource, _id: { $ne: id } });
      if (conflict) {
        return res.status(409).json({ success: false, message: "A redirect for this source already exists" });
      }
    }

    const updates = {};
    if (source !== undefined) updates.source = newSource;
    if (destination !== undefined) updates.destination = newDest;
    if (type !== undefined && ["301", "302"].includes(String(type))) updates.type = String(type);
    if (active !== undefined) updates.active = Boolean(active);

    const updated = await RedirectModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Redirect not found" });

    return res.status(200).json({ success: true, message: "Redirect updated", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /admin/redirects/:id ─────────────────────────────────────────────
export const deleteRedirect = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!["super_admin", "admin"].includes(user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;
    const redirect = await RedirectModel.findByIdAndDelete(id);
    if (!redirect) return res.status(404).json({ success: false, message: "Redirect not found" });

    return res.status(200).json({ success: true, message: "Redirect deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
