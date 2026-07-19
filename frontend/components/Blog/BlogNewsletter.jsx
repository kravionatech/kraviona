"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

const BlogNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state

  const handleSubmit = async (e) => {
    e.preventDefault(); // Form reload rokne ke liye

    // Basic frontend validation
    if (!email.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
        confirmButtonColor: "#d96c4e",
      });
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success !== false && !data?.error) {
        setEmail("");
        Swal.fire({
          icon: "success",
          title: "Subscribed",
          text: data?.message || "Successfully subscribed!",
          confirmButtonColor: "#d96c4e",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Subscription failed",
          text: data?.message || "Subscription failed.",
          confirmButtonColor: "#d96c4e",
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Newsletter Subscription Error:", error);
      }
      Swal.fire({
        icon: "error",
        title: "Connection issue",
        text:
          error.message ||
          "Something went wrong. Please check your connection.",
        confirmButtonColor: "#d96c4e",
      });
    } finally {
      setIsSubmitting(false); // Request complete hone par loading band
    }
  };

  return (
    <div
      className="bg-[#0f2425] w-full py-20 px-6 flex flex-col items-center justify-center text-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Subscribe to our Newsletter
        </h2>
        <p className="text-[#a4babb] text-sm md:text-base">
          Get the latest updates and insights directly in your inbox.
        </p>
      </div>

      {/* 💡 FIX: Changed to form tag so 'Enter' key works */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row w-full max-w-md gap-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hello@example.com"
          required
          disabled={isSubmitting} // Disable while submitting
          className="flex-1 bg-[#1b3d3e]/50 border border-[#295c5e] text-white px-5 py-3 rounded-lg outline-none focus:border-[#d96c4e] focus:ring-1 focus:ring-[#d96c4e] transition-all placeholder-[#6b8c8d] text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSubmitting} // Disable while submitting
          className="bg-[#d96c4e] text-white px-8 py-3 rounded-lg font-medium text-sm hover:bg-[#c45f43] active:scale-95 transition-all whitespace-nowrap disabled:bg-[#a8523b] disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
};

export default BlogNewsletter;
