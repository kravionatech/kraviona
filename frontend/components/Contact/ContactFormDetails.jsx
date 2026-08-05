"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { API_URL } from "@/utils/api";

const ContactFormDetails = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim() || "Service Inquiry",
          message: formData.message.trim(),
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success !== false) {
        Swal.fire({
          icon: "success",
          title: "Message sent",
          text:
            responseData.message ||
            "Message sent successfully! We'll contact you soon.",
          confirmButtonColor: "#B84A1A",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
          phone: "",
        });
      } else {
        throw new Error(
          responseData.error ||
            responseData.message ||
            "Failed to send message.",
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Contact form error:", error);
      }
      Swal.fire({
        icon: "error",
        title: "Message not sent",
        text:
          error.message ||
          "Something went wrong. Please check your connection.",
        confirmButtonColor: "#B84A1A",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Applied Poppins font globally to this section via inline style for guaranteed rendering
    // You can also add font-poppins to your tailwind.config.js
    <section
      className="relative bg-primary-tint py-20 text-primary md:py-28"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side: Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <div className="inline-block mb-4">
              <span className="rounded-full bg-accent-tint px-4 py-2 text-sm font-semibold uppercase tracking-wider text-accent-dark">
                Tell Us What You Need
              </span>
            </div>
            <h2 className="mb-8 text-4xl font-bold leading-[1.15] text-primary md:text-5xl">
              Let&apos;s make the next <br />
              build clearer.
            </h2>
            <p className="text-gray-500 mb-12 text-lg max-w-md leading-relaxed">
              Share your website, app, SEO, or automation requirement. We will
              review the details and reply with the most practical next step.
            </p>

            <div className="space-y-8">
              <ContactInfoItem
                title="Email Us"
                link="mailto:kravionatech@gmail.com"
                value="kravionatech@gmail.com"
                iconPath="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
              <ContactInfoItem
                title="Call Us"
                link="tel:+919608553167"
                value="+91 96085 53167"
                iconPath="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
              <ContactInfoItem
                title="Visit Us"
                link="https://maps.google.com/?q=East+Delhi+110092"
                value="East Delhi, Delhi 110092, India"
                iconPath="M12 21s7-5.373 7-12A7 7 0 105 9c0 6.627 7 12 7 12zM12 11.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"
              />
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="rounded-[2rem] border border-primary/15 bg-white p-8 shadow-card sm:p-10 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Amar"
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Kumar"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
                <FormInput
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <FormInput
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Next.js website or SEO audit"
              />

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you want to build, improve, or fix."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-primary/15 bg-surface px-5 py-4 font-medium text-primary outline-none transition-all placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-4.5 text-white rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-3 mt-4 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-accent-dark hover:brightness-90 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Project Details"}
                {!isSubmitting && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>
            </form>
            <a
              href="https://calendly.com/kravionatech"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Book a Free 30-Min Strategy Call
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Helper Sub-components ---

const FormInput = ({ label, name, ...props }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      {...props}
      className="w-full rounded-xl border border-primary/15 bg-surface px-5 py-4 font-medium text-primary outline-none transition-all placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30"
      required
    />
  </div>
);

const ContactInfoItem = ({ title, link, value, iconPath }) => (
  <div className="flex items-start gap-5 group">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-white shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:shadow-md">
      <svg
        className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={iconPath}
        />
      </svg>
    </div>
    <div className="pt-1">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {title}
      </h4>
      <a
        href={link}
        className="text-lg font-semibold text-primary transition-colors hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {value}
      </a>
    </div>
  </div>
);

export default ContactFormDetails;
