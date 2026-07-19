"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  PhoneCall,
  Mail,
  X,
  HeadphonesIcon,
} from "lucide-react";

const Support = () => {
  const [isOpen, setIsOpen] = useState(false);

  const supportLinks = [
    {
      id: "whatsapp",
      name: "WhatsApp Us",
      href: "https://wa.me/919608553167",
      icon: <MessageCircle className="w-5 h-5 text-white" />,
      bg: "bg-[#25D366]", // Standard WhatsApp Color for recognition
      hover: "hover:bg-[#1ebe5d]",
    },
    {
      id: "phone",
      name: "Call Support",
      href: "tel:+919608553167",
      icon: <PhoneCall className="w-5 h-5 text-white" />,
      bg: "bg-[#d96c4e]", // Kraviona Terracotta
      hover: "hover:bg-[#c25e41]",
    },
    {
      id: "email",
      name: "Email Us",
      href: "mailto:kravionatech@gmail.com",
      icon: <Mail className="w-5 h-5 text-[#295c5e]" />, // Dark Teal icon for contrast
      bg: "bg-[#f4be78]", // Kraviona Peach
      hover: "hover:bg-[#e0ad6a]",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Animated Menu Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, staggerChildren: 0.1 }}
            className="flex flex-col gap-3 mb-2"
          >
            {supportLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.href}
                aria-label={link.name}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out ${link.bg} ${link.hover}`}
              >
                <span className="font-medium text-sm text-white tracking-wide mix-blend-plus-lighter">
                  {link.name}
                </span>
                <div className="flex items-center justify-center">
                  {link.icon}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#295c5e] text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#f4be78]/20 hover:scale-105 transition-transform duration-300 z-50"
        aria-label="Support Menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-[#f4be78]" />
            </motion.div>
          ) : (
            <motion.div
              key="support"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HeadphonesIcon className="w-6 h-6 text-[#f4be78]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ping Animation Ring */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full border border-[#f4be78]/40 animate-ping opacity-75"></span>
        )}
      </button>
    </div>
  );
};

export default Support;
