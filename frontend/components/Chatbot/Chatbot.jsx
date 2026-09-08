"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Maximize2,
  Minimize2,
  CheckCircle2,
} from "lucide-react";
import { API_URL } from "@/utils/api";

const INITIAL_MESSAGE = {
  id: "welcome-msg",
  sender: "bot",
  text: `Hello! 👋 I'm Kraviona's AI Assistant.

I can help you with:
• **Web Engineering**: High-performance Next.js, React & MERN stack builds
• **Technical SEO**: Core Web Vitals, speed architecture & search growth
• **AI Workflows**: Custom automation systems & intelligent API integrations
• **Portfolio & Insights**: Client case studies and published technical articles

How can I assist you today?`,
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
    "What services does Kraviona offer?",
    "How can I contact the team?",
    "Tell me about MERN stack & SEO",
    "Where is Kraviona located?",
  ]);
  const [hasUnread, setHasUnread] = useState(true);
  const [networkError, setNetworkError] = useState(false);

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
        // Fallback default suggestions
      }
    }
    if (mounted) loadSuggestions();
  }, [mounted]);

  const handleSendMessage = async (textToSend) => {
    const query = String(textToSend || inputValue).trim();
    if (!query || isLoading) return;

    setNetworkError(false);
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

      if (response.ok && data.success) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.data?.reply || "I'm here to help with information from our website.",
          sources: data.data?.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.message || "Sorry, I couldn't complete that request. Please try again.",
          sources: [],
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      setNetworkError(true);
      const networkFailMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Could not connect to the assistant service. Please check your internet connection.",
        sources: [],
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, networkFailMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setNetworkError(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Basic markdown link and bold text parser
  const renderFormattedText = (content) => {
    if (!content) return null;
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }

        const linkText = match[1];
        const linkUrl = match[2];

        parts.push(
          <Link
            key={`link-${lineIdx}-${match.index}`}
            href={linkUrl}
            className="inline-flex items-center gap-1 font-semibold text-[#0f5960] hover:text-[#d85e3d] underline decoration-[#0f5960]/30 hover:decoration-[#d85e3d] transition-colors"
          >
            {linkText}
            <ExternalLink className="w-3 h-3 inline" />
          </Link>
        );

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
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

      return (
        <p key={`line-${lineIdx}`} className={lineIdx > 0 ? "mt-1.5" : ""}>
          {formattedParts}
        </p>
      );
    });
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Button Dock */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center select-none">
        {!isOpen && hasUnread && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 mr-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-teal-900/15 shadow-xl text-xs font-semibold text-[#0f5960] cursor-pointer hover:bg-white hover:scale-105 transition-all animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d85e3d]" />
            <span>Chat with Kraviona AI</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/30 active:scale-95 ${
            isOpen
              ? "bg-[#0d4248] text-white rotate-90"
              : "bg-[#0f5960] hover:bg-[#0a454b] text-white hover:scale-105"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d85e3d] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d85e3d]"></span>
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
              ? "inset-4 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[680px] sm:max-w-[calc(100vw-3rem)] sm:h-[750px] sm:max-h-[calc(100vh-8rem)] rounded-3xl"
              : "inset-x-2 bottom-2 top-20 sm:top-auto sm:bottom-24 sm:right-6 sm:inset-x-auto sm:w-[440px] sm:max-w-[calc(100vw-3rem)] sm:h-[620px] sm:max-h-[calc(100vh-8rem)] rounded-3xl"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Kraviona AI Assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0f5960] via-[#0d4248] to-[#0a454b] text-white select-none">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white shadow-inner">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0f5960]"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-white">Kraviona AI</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-teal-100/70">Verified Website Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse view" : "Expand view"}
                className="hidden sm:inline-flex p-2 rounded-xl text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle window size"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-2 rounded-xl text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize window"
                className="p-2 rounded-xl text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Minimize window"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8fafb]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#0f5960] shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#0f5960] text-white rounded-br-none shadow-md"
                      : msg.isError
                      ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-none shadow-sm"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="break-words space-y-1">
                    {msg.sender === "user" ? msg.text : renderFormattedText(msg.text)}
                  </div>

                  {/* Verified Sources Cited */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-slate-400 w-full font-semibold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#0f5960]" /> Verified Pages
                      </span>
                      {msg.sources.map((src, idx) => (
                        <Link
                          key={`src-${idx}`}
                          href={src.url}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 hover:bg-[#0f5960]/10 text-[#0f5960] border border-slate-200 hover:border-teal-300 px-2.5 py-1 rounded-lg transition-all"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[9px] text-right font-medium ${
                      msg.sender === "user" ? "text-teal-200/70" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0f5960] text-white shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Live Typing & Generation State */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#0f5960] shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0f5960] animate-bounce"></span>
                  <span
                    className="h-2 w-2 rounded-full bg-[#0f5960] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="h-2 w-2 rounded-full bg-[#0f5960] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    Analyzing public content...
                  </span>
                </div>
              </div>
            )}

            {/* Connection Error Message */}
            {networkError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Connection issue. Please retry.</span>
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  className="inline-flex items-center gap-1 font-semibold text-amber-950 underline hover:text-amber-800"
                >
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          {messages.length <= 2 && (
            <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex gap-2">
              {suggestions.slice(0, 4).map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="whitespace-nowrap text-[11px] text-slate-700 bg-slate-100 hover:bg-[#0f5960]/10 hover:text-[#0f5960] hover:border-teal-300 px-3 py-1.5 rounded-full transition-all border border-slate-200/80 font-medium shadow-2xs"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* User Input Bar */}
          <div className="p-3.5 bg-white border-t border-slate-200/90">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about web dev, SEO, case studies..."
                maxLength={500}
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0f5960]/30 focus:border-[#0f5960] transition-all disabled:opacity-60"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send query"
                className="absolute right-2 p-2 rounded-xl bg-[#0f5960] hover:bg-[#0a454b] text-white disabled:opacity-25 disabled:hover:bg-[#0f5960] transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400 font-medium">
              <span>Powered by Kraviona Verified Knowledge Base</span>
              {inputValue.length > 350 && <span>{inputValue.length}/500</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
