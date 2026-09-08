import {
  processChatQuery,
  getChatSuggestions,
  getKnowledgeIndex,
  invalidateChatbotIndex,
} from "../../services/chatbot/chatbot.service.js";
import { ChatLog } from "../../models/chatbot/chatLog.model.js";

/**
 * Public chat endpoint - No authentication required
 * POST /api/v1/chatbot/chat
 */
export const chatWithAssistant = async (req, res) => {
  try {
    const userMessage = req.sanitizedMessage || req.body?.message;

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown-client";

    const result = await processChatQuery(userMessage);

    // Asynchronously log the interaction to MongoDB with IP, query, and response
    ChatLog.create({
      ip,
      query: userMessage,
      reply: result.reply,
      responseType: result.type || "local-rag",
      sources: result.sources || [],
      userAgent: req.headers["user-agent"] || "",
    }).catch((err) => {
      console.error("[ChatLog Save Error]:", err?.message);
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[Public Chatbot Error]:", error?.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while answering your question. Please try again.",
    });
  }
};

/**
 * Public suggestions endpoint
 * GET /api/v1/chatbot/suggestions
 */
export const getSuggestions = async (_req, res) => {
  try {
    const suggestions = getChatSuggestions();
    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load suggestions",
    });
  }
};

/**
 * Public health & status check
 * GET /api/v1/chatbot/health
 */
export const getChatbotHealth = async (_req, res) => {
  try {
    const index = await getKnowledgeIndex();
    return res.status(200).json({
      success: true,
      status: "operational",
      totalIndexedPublicDocs: index?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: "error",
      message: error?.message,
    });
  }
};

/**
 * Sync / Invalidate index
 * POST /api/v1/chatbot/sync
 */
export const syncChatbotIndex = async (_req, res) => {
  try {
    invalidateChatbotIndex();
    await getKnowledgeIndex();
    return res.status(200).json({
      success: true,
      message: "Chatbot knowledge index synced successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

/**
 * Admin: Get all chatbot query logs with IP, Query, AI Reply, and Filters
 * GET /api/v1/admin/chatbot/logs
 */
export const getAdminChatLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ query: regex }, { ip: regex }, { reply: regex }];
    }
    if (req.query.responseType && req.query.responseType !== "all") {
      filter.responseType = req.query.responseType;
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [logs, total, todayCount, distinctIps] = await Promise.all([
      ChatLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ChatLog.countDocuments(filter),
      ChatLog.countDocuments({ createdAt: { $gte: startOfToday } }),
      ChatLog.distinct("ip"),
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalQueries: total,
        todayQueries: todayCount,
        uniqueIps: distinctIps.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to retrieve chatbot logs",
    });
  }
};

/**
 * Admin: Delete single chat log
 * DELETE /api/v1/admin/chatbot/logs/:id
 */
export const deleteAdminChatLog = async (req, res) => {
  try {
    const { id } = req.params;
    await ChatLog.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Chat log deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to delete chat log",
    });
  }
};
