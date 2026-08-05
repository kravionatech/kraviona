"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { API_URL } from "@/utils/api";

const createInitialForm = (initialSubject) => ({
  name: "",
  email: "",
  phone: "",
  message: "",
  subject: initialSubject,
});

const readResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
};

const splitName = (name) => {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "Customer",
  };
};

const BlogContactForm = ({ initialSubject = "" }) => {
  const [form, setForm] = useState(() => createInitialForm(initialSubject));
  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    setForm((currentForm) => ({
      ...currentForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!form.name.trim()) {
      setStatus({ loading: false, success: null, error: "Name is required" });
      Swal.fire({
        icon: "warning",
        title: "Name required",
        text: "Name is required",
        confirmButtonColor: "#E8622A",
      });
      return;
    }
    if (!form.email.trim()) {
      setStatus({ loading: false, success: null, error: "Email is required" });
      Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Email is required",
        confirmButtonColor: "#E8622A",
      });
      return;
    }
    if (!form.phone.trim()) {
      setStatus({ loading: false, success: null, error: "Phone is required" });
      Swal.fire({
        icon: "warning",
        title: "Phone required",
        text: "Phone is required",
        confirmButtonColor: "#E8622A",
      });
      return;
    }
    if (!form.message.trim()) {
      setStatus({
        loading: false,
        success: null,
        error: "Message is required",
      });
      Swal.fire({
        icon: "warning",
        title: "Message required",
        text: "Message is required",
        confirmButtonColor: "#E8622A",
      });
      return;
    }
    if (form.message.trim().length < 10) {
      setStatus({
        loading: false,
        success: null,
        error: "Message should be at least 10 characters",
      });
      Swal.fire({
        icon: "warning",
        title: "Message too short",
        text: "Message should be at least 10 characters",
        confirmButtonColor: "#E8622A",
      });
      return;
    }

    setStatus({ loading: true, success: null, error: null });

    try {
      const { firstName, lastName } = splitName(form.name);
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          subject: form.subject.trim() || "Service Inquiry",
        }),
      });

      const data = await readResponseBody(res);

      if (res.ok && data.success !== false) {
        setStatus({
          loading: false,
          success:
            data.message ||
            "Message sent successfully! We'll contact you soon.",
          error: null,
        });
        Swal.fire({
          icon: "success",
          title: "Message sent",
          text:
            data.message ||
            "Message sent successfully! We'll contact you soon.",
          confirmButtonColor: "#E8622A",
        });
        setForm(createInitialForm(initialSubject));

        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus((prev) => ({ ...prev, success: null }));
        }, 5000);
      } else {
        throw new Error(data.error || data.message || "Submission failed");
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Contact form error:", err);
      }
      setStatus({
        loading: false,
        success: null,
        error: err.message || "Failed to send message. Please try again.",
      });
      Swal.fire({
        icon: "error",
        title: "Message not sent",
        text: err.message || "Failed to send message. Please try again.",
        confirmButtonColor: "#E8622A",
      });
    }
  };

  return (
    <section className="mt-12 bg-gradient-to-br from-white to-[#F5F7F8] rounded-xl shadow-lg p-6 md:p-10 border border-[#D6E0E2]">
      <h3 className="text-2xl md:text-3xl font-bold text-[#2A4A52] mb-3">
        Need help with a related service?
      </h3>
      <p className="text-gray-600 mb-8">
        Share your service requirement and our team will reach out with the next
        steps.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <label className="sr-only" htmlFor="blog-contact-name">
            Full name
          </label>
          <input
            id="blog-contact-name"
            type="text"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8622A] focus:border-transparent transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="sr-only" htmlFor="blog-contact-email">
            Email address
          </label>
          <input
            id="blog-contact-email"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8622A] focus:border-transparent transition"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="sr-only" htmlFor="blog-contact-phone">
            Phone number
          </label>
          <input
            id="blog-contact-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8622A] focus:border-transparent transition"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="sr-only" htmlFor="blog-contact-subject">
            Subject
          </label>
          <input
            id="blog-contact-subject"
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8622A] focus:border-transparent transition"
          />
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label className="sr-only" htmlFor="blog-contact-message">
            Your message
          </label>
          <textarea
            id="blog-contact-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="Your message..."
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8622A] focus:border-transparent transition resize-none"
          />
        </div>

        {/* Submit & Status */}
        <div className="md:col-span-2 flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={status.loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8622A] text-white rounded-lg font-bold hover:bg-[#B84A1A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>

          <div className="text-sm flex-1" aria-live="polite">
            {status.success && (
              <span className="text-green-600 font-medium">
                {status.success}
              </span>
            )}
            {status.error && (
              <span className="text-red-600 font-medium">{status.error}</span>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default BlogContactForm;
