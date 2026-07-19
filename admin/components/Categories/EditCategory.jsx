"use client";
import { useState, useEffect } from "react";
import {
  FaHeading,
  FaAlignLeft,
  FaLink,
  FaTwitter,
  FaGlobe,
  FaSave,
  FaSearch,
  FaImage,
  FaSpinner,
  FaEdit,
  FaTimes
} from "react-icons/fa";
import Spinner from "../Loadingspinner";
import Swal from "sweetalert2";

const EditCategory = ({ id, setEditPageOpen }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form State
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

  // Fetch Existing Category Data
  useEffect(() => {
    if (!id) return;

    const fetchCategoryData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`);
        const result = await res.json();

        if (res.ok) {
          const data = result.data || result.category || result;
          
          setName(data.name || "");
          setDescription(data.description || "");
          setSlug(data.slug || "");
          setStatus(data.status || "published");
          setMetaTitle(data.metaTitle || "");
          setMetaDescription(data.metaDescription || "");
          setMetaKeywords(data.metaKeywords || "");
          setCanonicalUrl(data.canonicalUrl || "");
          setOgTitle(data.ogTitle || "");
          setOgDescription(data.ogDescription || "");
          setOgImage(data.ogImage || "");
          setTwitterTitle(data.twitterTitle || "");
          setTwitterDescription(data.twitterDescription || "");
          setTwitterImage(data.twitterImage || "");
        } else {
          Swal.fire({ icon: "error", title: "Error", text: "Failed to load category details." });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({ icon: "error", title: "Network Error", text: "Could not connect to the server." });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name, description, slug, status, metaTitle, metaDescription,
          canonicalUrl, ogTitle, ogDescription, ogImage, twitterTitle,
          twitterImage, twitterDescription
        })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Category Updated!",
          text: data.message || "Your category has been updated successfully.",
          confirmButtonColor: "#284043",
        }).then(() => {
          setEditPageOpen(false);
        });
        
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message || "Something went wrong while updating the category.",
          confirmButtonColor: "#284043",
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
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
  const inputBaseClasses = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#284043] focus:ring-2 focus:ring-[#284043]/10 transition-all duration-200 outline-none text-gray-700 text-sm";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";
  const sectionHeaderClasses = "text-base font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2 flex items-center gap-2";
  const themeColor = "text-[#284043]";

  return (
    // Fixed Background Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 font-sans">
      
      {/* Modal Container: Wider (max-w-6xl) and shorter max height (max-h-[85vh]) */}
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-fade-in-up">
        
        {/* Sticky Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#284043]/10 rounded-lg">
              <FaEdit className={`text-xl ${themeColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Edit Category</h2>
              <p className="text-xs text-gray-500 mt-0.5">Update the details of your existing category.</p>
            </div>
          </div>
          <button 
            onClick={() => setEditPageOpen(false)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10 bg-[#fefefe]">
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <Spinner size="md" section="Category Engine" title="Loading Category" message="Fetching existing data…" />
            </div>
          ) : (
            <form id="edit-category-form" onSubmit={handleSubmit}>
              
              {/* Basic Information */}
              <h3 className={sectionHeaderClasses}>Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                <div>
                  <label className={labelClasses}>
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaHeading className="absolute top-3.5 left-3.5 text-gray-400 text-sm" />
                    <input name="name" required value={name} onChange={(e) => setName(e.target.value)} className={`${inputBaseClasses} pl-10`} placeholder="e.g., Technology" />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaLink className="absolute top-3.5 left-3.5 text-gray-400 text-sm" />
                    <input name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} className={`${inputBaseClasses} pl-10`} placeholder="e.g., technology" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaAlignLeft className="absolute top-3.5 left-3.5 text-gray-400 text-sm" />
                    <textarea rows={3} required name="description" value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputBaseClasses} pl-10`} placeholder="Brief description of the category..." />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Status</label>
                  <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputBaseClasses}>
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
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-8 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <div>
                  <label className={labelClasses}>Meta Title</label>
                  <input name="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputBaseClasses} placeholder="SEO Title" />
                </div>
                <div>
                  <label className={labelClasses}>Canonical URL</label>
                  <input name="canonicalUrl" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} className={inputBaseClasses} placeholder="https://example.com/category" />
                </div>
                <div>
                  <label className={labelClasses}>Meta Description</label>
                  <textarea rows={2} name="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className={inputBaseClasses} placeholder="Search engine description..." />
                </div>
                <div>
                  <label className={labelClasses}>Meta Keywords</label>
                  <textarea rows={2} name="metaKeywords" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} className={inputBaseClasses} placeholder="seo, blog, react (comma separated)" />
                </div>
              </div>

              {/* Open Graph */}
              <h3 className={sectionHeaderClasses}>
                <FaGlobe className={themeColor} />
                Open Graph (Facebook/LinkedIn)
              </h3>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                <div>
                  <label className={labelClasses}>OG Title</label>
                  <input name="ogTitle" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} className={inputBaseClasses} placeholder="Open Graph Title" />
                </div>
                <div>
                  <label className={labelClasses}>OG Image URL</label>
                  <div className="relative">
                    <FaImage className="absolute top-3.5 left-3.5 text-gray-400 text-sm" />
                    <input name="ogImage" value={ogImage} onChange={(e) => setOgImage(e.target.value)} className={`${inputBaseClasses} pl-10`} placeholder="https://..." />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>OG Description</label>
                  <textarea rows={2} name="ogDescription" value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} className={inputBaseClasses} placeholder="Open Graph Description" />
                </div>
              </div>

              {/* Twitter */}
              <h3 className={sectionHeaderClasses}>
                <FaTwitter className="text-[#1DA1F2]" />
                Twitter Card
              </h3>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 pb-4">
                <div>
                  <label className={labelClasses}>Twitter Title</label>
                  <input name="twitterTitle" value={twitterTitle} onChange={(e) => setTwitterTitle(e.target.value)} className={inputBaseClasses} placeholder="Twitter Title" />
                </div>
                <div>
                  <label className={labelClasses}>Twitter Image URL</label>
                  <div className="relative">
                    <FaImage className="absolute top-3.5 left-3.5 text-gray-400 text-sm" />
                    <input name="twitterImage" value={twitterImage} onChange={(e) => setTwitterImage(e.target.value)} className={`${inputBaseClasses} pl-10`} placeholder="https://..." />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Twitter Description</label>
                  <textarea rows={2} name="twitterDescription" value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} className={inputBaseClasses} placeholder="Twitter Description" />
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Sticky Footer for Buttons */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl z-10">
          <button
            type="button"
            onClick={() => setEditPageOpen(false)}
            disabled={loading}
            className="px-6 py-2.5 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="edit-category-form"
            disabled={loading || initialLoading}
            className={`flex items-center justify-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm ${
              loading || initialLoading
                ? "bg-[#284043]/70 cursor-not-allowed"
                : "bg-[#284043] hover:bg-[#1d3032] shadow-[#284043]/20"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-base" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="text-base" />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditCategory;