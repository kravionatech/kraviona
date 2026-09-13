"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  Send,
  Trash2,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  Maximize2,
  Minimize2,
  CheckCircle2,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import { getFallbackChatResponse } from "./fallbackKnowledge";

const INITIAL_MESSAGE = {
  id: "welcome-msg",
  sender: "bot",
  text: `Hello! 👋 I'm Kraviona's AI Assistant.

Ask me about our **Web Development**, **Technical SEO**, **Pricing**, or **Case Studies**. How can I assist you today?`,
  sources: [],
  timestamp: "Just now",
};

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What services do you offer?",
    "How can I contact the team?",
    "What are your pricing plans?",
    "Where is Kraviona located?",
  ]);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const res = await fetch(`${API_URL}/chatbot/suggestions`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.data) && json.data.length > 0) {
            setSuggestions(json.data);
          }
        }
      } catch {
        // Retain default verified suggestions
      }
    }
    if (mounted) loadSuggestions();
  }, [mounted]);

  const handleSendMessage = async (textToSend) => {
    const query = String(textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data?.reply) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.data.reply,
          sources: data.data?.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Seamless fallback to client knowledge engine
        const fallback = getFallbackChatResponse(query);
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: fallback.reply,
          sources: fallback.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      // Offline / network failure resilience
      const fallback = getFallbackChatResponse(query);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: fallback.reply,
        sources: fallback.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Formatted markdown link, bold, and header parser
  const renderFormattedText = (content) => {
    if (!content) return null;
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      // Clean header hashtags if present
      const isHeader = /^#{1,6}\s+/.test(line);
      const cleanLine = line.replace(/^#{1,6}\s+/, "");

      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }

        const linkText = match[1];
        const linkUrl = match[2];
        const isInternal = linkUrl.startsWith("/") && !linkUrl.startsWith("//");

        parts.push(
          isInternal ? (
            <Link
              key={`link-${lineIdx}-${match.index}`}
              href={linkUrl}
              className="inline-flex items-center gap-0.5 font-semibold text-[#0f5960] hover:text-[#d85e3d] underline decoration-[#0f5960]/30 hover:decoration-[#d85e3d] transition-colors"
            >
              {linkText}
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </Link>
          ) : (
            <a
              key={`link-${lineIdx}-${match.index}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-[#0f5960] hover:text-[#d85e3d] underline decoration-[#0f5960]/30 hover:decoration-[#d85e3d] transition-colors"
            >
              {linkText}
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </a>
          )
        );

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      const formattedParts = parts.map((part, partIdx) => {
        if (typeof part !== "string") return part;

        const boldRegex = /\*\*([^*]+)\*\*/g;
        const subParts = [];
        let subLast = 0;
        let bMatch;

        while ((bMatch = boldRegex.exec(part)) !== null) {
          if (bMatch.index > subLast) {
            subParts.push(part.substring(subLast, bMatch.index));
          }
          subParts.push(
            <strong key={`b-${lineIdx}-${partIdx}-${bMatch.index}`} className="font-semibold text-slate-900">
              {bMatch[1]}
            </strong>
          );
          subLast = bMatch.index + bMatch[0].length;
        }

        if (subLast < part.length) {
          subParts.push(part.substring(subLast));
        }

        return <React.Fragment key={`p-${partIdx}`}>{subParts}</React.Fragment>;
      });

      if (!line.trim()) {
        return <div key={`empty-${lineIdx}`} className="h-1" />;
      }

      return (
        <p
          key={`line-${lineIdx}`}
          className={`${lineIdx > 0 ? "mt-1" : ""} ${isHeader ? "font-semibold text-slate-900 text-[11.5px] sm:text-xs" : ""}`}
        >
          {formattedParts}
        </p>
      );
    });
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Button Dock — sits above the WhatsApp FAB on mobile */}
      <div className="fixed bottom-[88px] sm:bottom-6 right-6 z-50 flex items-center select-none">
        {!isOpen && hasUnread && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 mr-2.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-teal-900/15 shadow-lg text-[11px] font-medium text-[#0f5960] cursor-pointer hover:bg-white hover:scale-105 transition-all animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <Sparkles className="w-3 h-3 text-[#d85e3d]" />
            <span>Chat with Kraviona AI</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-teal-500/30 active:scale-95 ${
            isOpen
              ? "bg-[#0d4248] text-white rotate-90"
              : "bg-[#0f5960] hover:bg-[#0a454b] text-white hover:scale-105"
          }`}
        >
          {isOpen ? (
            <X className="w-4 h-4 transition-transform" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d85e3d] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d85e3d]"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Main Chatbot Canvas Window */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-white shadow-2xl border border-teal-900/15 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            isExpanded
              ? "inset-3 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-[480px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[560px] sm:max-h-[calc(100vh-6.5rem)] rounded-2xl"
              : "inset-x-3 bottom-3 top-20 sm:top-auto sm:bottom-20 sm:right-6 sm:inset-x-auto sm:w-[340px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[470px] sm:max-h-[calc(100vh-6.5rem)] rounded-2xl"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Kraviona AI Assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-[#0f5960] via-[#0d4248] to-[#0a454b] text-white select-none">
            <div className="flex items-center gap-2">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white shadow-inner">
                <Bot className="w-3.5 h-3.5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1.5 ring-[#0f5960]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold tracking-tight text-white">Kraviona AI</h3>
                  <span className="text-[8.5px] font-medium uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1 py-0.2 rounded-full">
                    Online
                  </span>
                </div>
                <p className="text-[9.5px] text-teal-100/75 leading-none">Verified Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse view" : "Expand view"}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle window size"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize window"
                className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Minimize window"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-2.5 bg-[#f8fafb]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#0f5960] shadow-2xs">
                    <Bot className="w-3 h-3" />
                  </div>
                )}

                <div
                  className={`max-w-[86%] rounded-xl px-3 py-2 text-[11px] sm:text-[11.5px] leading-snug ${
                    msg.sender === "user"
                      ? "bg-[#0f5960] text-white rounded-br-none shadow-xs"
                      : msg.isError
                      ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-none shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-xs"
                  }`}
                >
                  <div className="break-words space-y-0.5">
                    {msg.sender === "user" ? msg.text : renderFormattedText(msg.text)}
                  </div>

                  {/* Verified Sources Cited */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-wrap gap-1">
                      <span className="text-[8.5px] text-slate-400 w-full font-medium uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#0f5960]" /> Verified Pages
                      </span>
                      {msg.sources.map((src, idx) => (
                        <Link
                          key={`src-${idx}`}
                          href={src.url}
                          className="inline-flex items-center gap-1 text-[9.5px] font-medium bg-slate-50 hover:bg-[#0f5960]/10 text-[#0f5960] border border-slate-200 hover:border-teal-300 px-2 py-0.5 rounded-md transition-all"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-2 h-2 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div
                    className={`mt-1 text-[8px] text-right font-medium ${
                      msg.sender === "user" ? "text-teal-200/70" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0f5960] text-white shadow-2xs">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}

            {/* Live Typing & Generation State */}
            {isLoading && (
              <div className="flex gap-2 justify-start items-center">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#0f5960] shadow-2xs">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-white border border-slate-200/90 rounded-xl rounded-bl-none px-3 py-2 shadow-xs flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0f5960] animate-bounce"></span>
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#0f5960] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#0f5960] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                  <span className="text-[10px] text-slate-500 font-medium ml-1">
                    Analyzing...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          {messages.length <= 2 && (
            <div className="px-3 py-1.5 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex gap-1.5">
              {suggestions.slice(0, 4).map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="whitespace-nowrap text-[10px] text-slate-700 bg-slate-100 hover:bg-[#0f5960]/10 hover:text-[#0f5960] hover:border-teal-300 px-2.5 py-1 rounded-full transition-all border border-slate-200/80 font-medium shadow-2xs"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* User Input Bar */}
          <div className="p-2.5 bg-white border-t border-slate-200/90">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about web dev, SEO, pricing..."
                maxLength={500}
                disabled={isLoading}
                className="w-full pl-3 pr-8 py-1.5 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5960]/30 focus:border-[#0f5960] transition-all disabled:opacity-60"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send query"
                className="absolute right-1.5 p-1.5 rounded-lg bg-[#0f5960] hover:bg-[#0a454b] text-white disabled:opacity-25 disabled:hover:bg-[#0f5960] transition-all shadow-xs"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1 px-1 text-[8.5px] text-slate-400 font-medium">
              <span>Verified Kraviona AI</span>
              {inputValue.length > 350 && <span>{inputValue.length}/500</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
