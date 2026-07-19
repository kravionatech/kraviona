"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// FAQ Data
const faqs = [
  {
    question: "How long does a project typically take?",
    answer:
      "Project timelines depend on scope. A simple website takes 2-3 weeks, a custom web application 4-8 weeks, and a large-scale platform 3-6 months. We provide a detailed timeline in our project proposal after the discovery call.",
  },
  {
    question: "Do you sign NDAs?",
    answer:
      "Yes, absolutely. We sign Non-Disclosure Agreements (NDAs) before starting any project. Your business idea, data, and code are completely confidential. Contact us to request our standard NDA template.",
  },
  {
    question: "What is your payment structure?",
    answer:
      "We typically work on a 50/50 payment model: 50% upfront to begin the project, 50% on final delivery. For larger projects, we offer milestone-based payment schedules. We accept bank transfer (IMPS/NEFT) and UPI.",
  },
  {
    question: "Do you offer post-launch support?",
    answer:
      "Yes. Every project includes 30 days of free post-launch support covering bug fixes and minor changes. After that, we offer affordable monthly maintenance retainer plans.",
  },
  {
    question: "Can I book a free consultation?",
    answer:
      "Yes! We offer a free 30-minute discovery call where we understand your requirements and suggest the best approach. You can call us at +91 96085 53167, message on WhatsApp, or fill the contact form and we'll schedule a call.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes, we work with clients globally. We accept international payments via bank wire transfer and Wise. Our team is available during IST business hours and we're flexible for calls across time zones.",
  },
];

const ContactFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#f9fafb] font-sans border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#d96c4e] font-bold tracking-[0.3em] text-[10px] uppercase">
            Clear Your Doubts
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1b3d3e] tracking-tight mt-2">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#295c5e] to-[#d96c4e]">
              Questions
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#295c5e] transition-colors duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`contact-faq-answer-${index}`}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
              >
                <h3
                  className={`text-lg font-bold transition-colors duration-300 ${activeIndex === index ? "text-[#d96c4e]" : "text-[#1b3d3e] group-hover:text-[#295c5e]"}`}
                >
                  {faq.question}
                </h3>

                {/* Plus/Minus Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${activeIndex === index ? "bg-[#d96c4e] text-white rotate-180" : "bg-[#f4f7f7] text-[#295c5e] group-hover:bg-[#1b3d3e] group-hover:text-white"}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {activeIndex === index ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M20 12H4"
                      /> // Minus
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      /> // Plus
                    )}
                  </svg>
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div
                      id={`contact-faq-answer-${index}`}
                      className="px-6 pb-6 text-gray-500 leading-relaxed text-sm"
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
