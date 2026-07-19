"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js App Router
import {
  FaFolderPlus,
  FaHeading,
  FaAlignLeft,
  FaLink,
  FaTwitter,
  FaGlobe,
  FaSave,
  FaSearch,
  FaImage,
  FaSpinner
} from "react-icons/fa";
import Spinner from "../Loadingspinner";
import Swal from "sweetalert2";

export default function CreateCategory() {
  const router = useRouter(); // Initialize the router
  const [loading, setLoading] = useState(false);

  // Your Variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("published");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [twitterImage, setTwitterImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-category`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          slug,
          status,
          metaTitle,
          metaDescription,
          canonicalUrl,
          ogTitle,
          ogDescription,
          ogImage,
          twitterTitle,
          twitterImage,
          twitterDescription
        })
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Category Created!",
          text: data.message || "Your new category has been saved successfully.",
          confirmButtonColor: "#284043",
        }).then(() => {
          // Push to category page after the alert is closed
          router.push('/category');
        });
        
      } else {
        // Show error alert from backend
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: data.message || "Something went wrong while saving the category.",
          confirmButtonColor: "#284043",
        });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      // Show network error alert
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not connect to the server. Please try again later.",
        confirmButtonColor: "#284043",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reusable classes
  const inputBaseClasses =
    "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#284043] focus:ring-4 focus:ring-[#284043]/10 transition-all duration-200 outline-none text-gray-700";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const sectionHeaderClasses =
    "text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 flex items-center gap-2";
  const themeColor = "text-[#284043]"; // Matched with your sidebar theme

  if (loading) {
    return (
      <div>
        <Spinner size="md" section="Category Engine" title="Category Post" message="Adding the latest data…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-[#284043]/10 rounded-xl">
            <FaFolderPlus className={`text-2xl ${themeColor}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Category</h2>
            <p className="text-sm text-gray-500 mt-1">
              Add a new category to organize your content.
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <h3 className={sectionHeaderClasses}>Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5 mb-10">
          <div>
            <label className={labelClasses}>
              Category Name <span className="text-red-500 text-base">*</span>
            </label>
            <div className="relative">
              <FaHeading className="absolute top-4 left-4 text-gray-400" />
              <input
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${inputBaseClasses} pl-11`}
                placeholder="e.g., Technology"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              Slug <span className="text-red-500 text-base">*</span>
            </label>
            <div className="relative">
              <FaLink className="absolute top-4 left-4 text-gray-400" />
              <input
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={`${inputBaseClasses} pl-11`}
                placeholder="e.g., technology"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClasses}>
              Description <span className="text-red-500 text-base">*</span>
            </label>
            <div className="relative">
              <FaAlignLeft className="absolute top-4 left-4 text-gray-400" />
              <textarea
                rows={4}
                required
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputBaseClasses} pl-11`}
                placeholder="Brief description of the category..."
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Status</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputBaseClasses}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* SEO Information */}
        <h3 className={sectionHeaderClasses}>
          <FaSearch className="text-gray-400" />
          SEO Information
        </h3>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5 mb-10 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
          <div>
            <label className={labelClasses}>Meta Title</label>
            <input
              name="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className={inputBaseClasses}
              placeholder="SEO Title"
            />
          </div>

          <div>
            <label className={labelClasses}>Canonical URL</label>
            <input
              name="canonicalUrl"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className={inputBaseClasses}
              placeholder="https://example.com/category"
            />
          </div>

          <div>
            <label className={labelClasses}>Meta Description</label>
            <textarea
              rows={3}
              name="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className={inputBaseClasses}
              placeholder="Search engine description..."
            />
          </div>

          <div>
            <label className={labelClasses}>Meta Keywords</label>
            <textarea
              rows={3}
              name="metaKeywords"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              className={inputBaseClasses}
              placeholder="seo, blog, react (comma separated)"
            />
          </div>
        </div>

        {/* Open Graph */}
        <h3 className={sectionHeaderClasses}>
          <FaGlobe className={themeColor} />
          Open Graph (Facebook/LinkedIn)
        </h3>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5 mb-10">
          <div>
            <label className={labelClasses}>OG Title</label>
            <input
              name="ogTitle"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              className={inputBaseClasses}
              placeholder="Open Graph Title"
            />
          </div>

          <div>
            <label className={labelClasses}>OG Image URL</label>
            <div className="relative">
              <FaImage className="absolute top-4 left-4 text-gray-400" />
              <input
                name="ogImage"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className={`${inputBaseClasses} pl-11`}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClasses}>OG Description</label>
            <textarea
              rows={2}
              name="ogDescription"
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              className={inputBaseClasses}
              placeholder="Open Graph Description"
            />
          </div>
        </div>

        {/* Twitter */}
        <h3 className={sectionHeaderClasses}>
          <FaTwitter className="text-[#1DA1F2]" />
          Twitter Card
        </h3>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5 mb-10">
          <div>
            <label className={labelClasses}>Twitter Title</label>
            <input
              name="twitterTitle"
              value={twitterTitle}
              onChange={(e) => setTwitterTitle(e.target.value)}
              className={inputBaseClasses}
              placeholder="Twitter Title"
            />
          </div>

          <div>
            <label className={labelClasses}>Twitter Image URL</label>
            <div className="relative">
              <FaImage className="absolute top-4 left-4 text-gray-400" />
              <input
                name="twitterImage"
                value={twitterImage}
                onChange={(e) => setTwitterImage(e.target.value)}
                className={`${inputBaseClasses} pl-11`}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClasses}>Twitter Description</label>
            <textarea
              rows={2}
              name="twitterDescription"
              value={twitterDescription}
              onChange={(e) => setTwitterDescription(e.target.value)}
              className={inputBaseClasses}
              placeholder="Twitter Description"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-200 shadow-md w-full md:w-auto ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#284043] hover:bg-[#1d3032] shadow-[#284043]/20"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="text-lg animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="text-lg" />
                Save Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}