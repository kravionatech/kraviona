"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_FAQS } from "@/lib/contactFaqs";

const ContactFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="border-t border-primary/10 bg-surface py-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent-dark font-bold tracking-[0.3em] text-[10px] uppercase">
            Clear Your Doubts
          </span>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-primary md:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-accent-dark bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {CONTACT_FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden rounded-2xl border border-primary/15 bg-white transition-colors duration-300 hover:border-primary"
            >
              <h3>
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                  aria-controls={`contact-faq-answer-${index}`}
                  className="group flex w-full items-center justify-between p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <span
                    className={`text-lg font-bold transition-colors duration-300 ${activeIndex === index ? "text-accent-dark" : "text-primary group-hover:text-primary-hover"}`}
                  >
                    {faq.question}
                  </span>

                {/* Plus/Minus Icon */}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${activeIndex === index ? "rotate-180 bg-accent-dark text-white" : "bg-surface-2 text-primary group-hover:bg-primary group-hover:text-white"}`}
                    aria-hidden="true"
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
                  </span>
                </button>
              </h3>

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
