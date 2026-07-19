"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Swal from "sweetalert2";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MessageSquareText,
  Phone,
  User,
  X,
} from "lucide-react";

const SERVICE_OPTIONS = [
  "MERN Stack Development",
  "React Development",
  "Node.js Development",
  "Web App Development",
  "Technical SEO",
  "AI Automation",
  "UI/UX Design",
  "Digital Marketing",
  "Other Service",
];

const BUDGET_OPTIONS = [
  "Need guidance",
  "Under ₹50,000",
  "₹50,000 - ₹1,50,000",
  "₹1,50,000+",
];

const SERVICE_SLUG_LABELS = {
  "ai-automation": "AI Automation",
  "api-development": "Web App Development",
  "backend-development": "Node.js Development",
  "database-architecture": "Other Service",
  "digital-marketing": "Digital Marketing",
  "full-stack-development": "MERN Stack Development",
  "mern-stack-development": "MERN Stack Development",
  "nodejs-development": "Node.js Development",
  "react-development": "React Development",
  "saas-development": "Web App Development",
  "technical-seo": "Technical SEO",
  "ui-ux-design": "UI/UX Design",
  "web-app-development": "Web App Development",
  "web-performance-optimization": "Technical SEO",
};

const getServiceFromPath = (pathname) => {
  const slug = pathname?.split("/services/")[1]?.split("/")[0];

  if (!slug) return "";
  if (SERVICE_SLUG_LABELS[slug]) return SERVICE_SLUG_LABELS[slug];

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const createInitialForm = (pathname) => ({
  name: "",
  email: "",
  phone: "",
  company: "",
  service: getServiceFromPath(pathname),
  budget: "Need guidance",
  message: "",
});

const createLeadPayload = ({ form, serviceLabel, pathname, sourceUrl }) => {
  const selectedService = form.service || serviceLabel;
  const leadMessage = [
    `Service: ${selectedService}`,
    `Budget: ${form.budget}`,
    form.company ? `Company: ${form.company}` : "",
    "",
    form.message.trim(),
    "",
    `Lead source: ${sourceUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    subject: `Lead Inquiry: ${selectedService}`,
    message: leadMessage,
    leadType: "service-popup",
    page: pathname,
    service: selectedService,
    budget: form.budget,
    company: form.company.trim(),
  };
};

const LeadGenerationPopup = () => {
  const pathname = usePathname();
  const shouldShowOnPage =
    pathname === "/services" || pathname?.startsWith("/services/");

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(() => createInitialForm(pathname));
  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const serviceLabel = useMemo(
    () => getServiceFromPath(pathname) || "your service requirement",
    [pathname],
  );

  useEffect(() => {
    setForm((current) => ({
      ...current,
      service: current.service || getServiceFromPath(pathname),
    }));
  }, [pathname]);

  useEffect(() => {
    if (!shouldShowOnPage) return undefined;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [pathname, shouldShowOnPage]);

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, success: "", error: "" });

    const leadPayload = createLeadPayload({
      form,
      serviceLabel,
      pathname,
      sourceUrl: window.location.href,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.error || data.message || "Unable to send lead.");
      }

      setStatus({
        loading: false,
        success: "Thanks. Kraviona team will contact you shortly.",
        error: "",
      });
      setForm(createInitialForm(pathname));

      await Swal.fire({
        icon: "success",
        title: "Lead request sent",
        text:
          data.message ||
          "Thanks. Kraviona team will contact you shortly.",
        confirmButtonColor: "#d96c4e",
      });
      setIsOpen(false);
    } catch (error) {
      setStatus({
        loading: false,
        success: "",
        error:
          error.message ||
          "Something went wrong. Please try again or contact us directly.",
      });
      Swal.fire({
        icon: "error",
        title: "Lead request failed",
        text:
          error.message ||
          "Something went wrong. Please try again or contact us directly.",
        confirmButtonColor: "#d96c4e",
      });
    }
  };

  if (!shouldShowOnPage || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#081314]/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-white/15 bg-white shadow-[0_28px_80px_-24px_rgba(8,19,20,0.55)]">
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close lead form"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#d96c4e]/50 hover:bg-[#d96c4e] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="bg-[#0f2425] p-6 text-white sm:p-7">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#f4be78]">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Service Lead
            </span>
            <h2 className="text-2xl font-black leading-tight sm:text-3xl">
              Need help with {serviceLabel}?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#c5d3d4]">
              Share your requirement and we will review the project context
              before contacting you.
            </p>
            <div className="mt-6 space-y-3 text-sm text-[#d9e4e5]">
              {[
                "Clear response within one business day",
                "Service-specific discussion, no generic pitch",
                "WhatsApp, call, or email follow-up",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#f4be78]" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
            <div className="mt-7 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#f4be78]">
                Direct Contact
              </p>
              <a
                href="tel:+919608553167"
                className="mt-3 flex items-center gap-2 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4" />
                +91 96085 53167
              </a>
              <a
                href="mailto:kravionatech@gmail.com"
                className="mt-2 flex items-center gap-2 text-sm font-semibold text-white"
              >
                <Mail className="h-4 w-4" />
                kravionatech@gmail.com
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-7">
            <div className="pr-12">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d96c4e]">
                Quick Inquiry
              </p>
              <h3 className="mt-2 text-xl font-black text-[#111A1F]">
                Tell us what you need
              </h3>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Full Name
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-gray-200 bg-[#FAFCFC] px-4 py-3 focus-within:border-[#295c5e] focus-within:ring-2 focus-within:ring-[#295c5e]/15">
                <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full bg-transparent text-sm font-medium text-[#111A1F] outline-none placeholder:text-gray-400"
                />
              </span>
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFCFC] px-4 py-3 text-sm font-medium text-[#111A1F] outline-none transition focus:border-[#295c5e] focus:ring-2 focus:ring-[#295c5e]/15"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91..."
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFCFC] px-4 py-3 text-sm font-medium text-[#111A1F] outline-none transition focus:border-[#295c5e] focus:ring-2 focus:ring-[#295c5e]/15"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Service
                </span>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFCFC] px-4 py-3 text-sm font-medium text-[#111A1F] outline-none transition focus:border-[#295c5e] focus:ring-2 focus:ring-[#295c5e]/15"
                >
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Budget
                </span>
                <select
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFCFC] px-4 py-3 text-sm font-medium text-[#111A1F] outline-none transition focus:border-[#295c5e] focus:ring-2 focus:ring-[#295c5e]/15"
                >
                  {BUDGET_OPTIONS.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Company
              </span>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company or website"
                className="w-full rounded-xl border border-gray-200 bg-[#FAFCFC] px-4 py-3 text-sm font-medium text-[#111A1F] outline-none transition focus:border-[#295c5e] focus:ring-2 focus:ring-[#295c5e]/15"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Requirement
              </span>
              <span className="flex items-start gap-2 rounded-xl border border-gray-200 bg-[#FAFCFC] px-4 py-3 focus-within:border-[#295c5e] focus-within:ring-2 focus-within:ring-[#295c5e]/15">
                <MessageSquareText className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Tell us about your goal, timeline, or current issue."
                  className="w-full resize-none bg-transparent text-sm font-medium text-[#111A1F] outline-none placeholder:text-gray-400"
                />
              </span>
            </label>

            {(status.success || status.error) && (
              <p
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                  status.success
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.success || status.error}
              </p>
            )}

            <button
              type="submit"
              disabled={status.loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d96c4e] px-5 py-3.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#c25e41] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {status.loading ? "Sending..." : "Send Lead Request"}
              {!status.loading && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-gray-500">
              By submitting, you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-[#d96c4e] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadGenerationPopup;
