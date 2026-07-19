"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const perks = [
  "Personalised technical SEO audit report",
  "Core Web Vitals performance analysis",
  "Competitor gap analysis & quick wins",
  "Delivered within 48 hours — completely free",
];

const LeadCapture = () => {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);

    // Placeholder: integrate with your backend/CRM
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // simulate API call
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="py-20 md:py-24 bg-gradient-to-br from-[#0b1e20] via-[#0f2425] to-[#071314] relative overflow-hidden border-y border-white/5"
      aria-labelledby="lead-capture-heading"
    >
      {/* Background decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d96c4e]/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#295c5e]/12 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d96c4e]/12 border border-[#d96c4e]/25 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#f4be78]" aria-hidden="true" />
              <span className="text-[#f4be78] text-xs font-bold uppercase tracking-widest">
                Free SEO Audit
              </span>
            </div>

            <h2
              id="lead-capture-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 leading-[1.1] tracking-tight"
            >
              Get Your Free{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
                SEO Audit
              </span>{" "}
              Report
            </h2>

            <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
              Discover exactly what&apos;s holding your website back from
              ranking on page one. Our experts will analyse your site and
              deliver a personalised action plan.
            </p>

            <ul className="space-y-3.5" role="list" aria-label="What you get">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-3 text-gray-300 text-sm font-medium"
                >
                  <CheckCircle
                    className="w-5 h-5 text-[#f4be78] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  {perk}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {submitted ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f4be78]/15 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-[#f4be78]" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">
                  Request Received!
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Our SEO team will review your website and send a personalised
                  audit report within{" "}
                  <strong className="text-white">48 hours</strong>.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
                aria-label="Free SEO audit request form"
                noValidate
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  Request Your Free Audit
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="audit-email"
                      className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"
                    >
                      Business Email *
                    </label>
                    <input
                      id="audit-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-[#d96c4e]/50 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 text-sm outline-none transition-all duration-200 focus:bg-white/8 focus:ring-2 focus:ring-[#d96c4e]/20"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="audit-website"
                      className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"
                    >
                      Website URL
                    </label>
                    <input
                      id="audit-website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-[#d96c4e]/50 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 text-sm outline-none transition-all duration-200 focus:bg-white/8 focus:ring-2 focus:ring-[#d96c4e]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="audit-submit-btn"
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-[#d96c4e] to-[#c25e41] text-white font-bold rounded-xl hover:shadow-[0_6px_24px_rgba(217,108,78,0.45)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none text-sm mt-2"
                    aria-label="Get my free SEO audit"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending Request…
                      </span>
                    ) : (
                      <>
                        Get My Free SEO Audit
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-gray-500 text-[11px] mt-4 text-center leading-relaxed">
                  No spam. No credit card required. We respect your privacy.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeadCapture;
