"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

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
        confirmButtonColor: "#d96c4e",
      });
      return;
    }
    if (!form.email.trim()) {
      setStatus({ loading: false, success: null, error: "Email is required" });
      Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Email is required",
        confirmButtonColor: "#d96c4e",
      });
      return;
    }
    if (!form.phone.trim()) {
      setStatus({ loading: false, success: null, error: "Phone is required" });
      Swal.fire({
        icon: "warning",
        title: "Phone required",
        text: "Phone is required",
        confirmButtonColor: "#d96c4e",
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
        confirmButtonColor: "#d96c4e",
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
        confirmButtonColor: "#d96c4e",
      });
      return;
    }

    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          subject: form.subject.trim() || "Service Inquiry",
        }),
      });

      const data = await readResponseBody(res);

      if (res.ok && data.ok !== false) {
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
          confirmButtonColor: "#d96c4e",
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
        confirmButtonColor: "#d96c4e",
      });
    }
  };

  return (
    <section className="mt-12 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 md:p-10 border border-gray-200">
      <h3 className="text-2xl md:text-3xl font-bold text-[#0f2425] mb-3">
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
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d96c4e] focus:border-transparent transition"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d96c4e] focus:border-transparent transition"
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone number"
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d96c4e] focus:border-transparent transition"
        />

        {/* Subject */}
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d96c4e] focus:border-transparent transition"
        />

        {/* Message */}
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          placeholder="Your message..."
          rows="5"
          className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d96c4e] focus:border-transparent transition resize-none"
        />

        {/* Submit & Status */}
        <div className="md:col-span-2 flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={status.loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d96c4e] text-white rounded-lg font-bold hover:bg-[#c25e41] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="text-sm flex-1">
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
