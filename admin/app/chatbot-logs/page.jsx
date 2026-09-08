import Frame from "@/components/Frame/Frame";
import ChatbotLogsPage from "@/components/ChatbotLogs/ChatbotLogsPage";
import React from "react";

export const metadata = {
  title: "AI Chatbot Logs | Kraviona Admin",
  description: "View visitor queries, client IP addresses, and AI chatbot responses.",
};

export default function ChatbotLogs() {
  return (
    <Frame>
      <ChatbotLogsPage />
    </Frame>
  );
}
