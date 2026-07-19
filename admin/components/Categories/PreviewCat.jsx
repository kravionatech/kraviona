"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaTimes, FaSpinner, FaHeading, FaGlobe, FaSearch, FaTwitter } from "react-icons/fa";
import Spinner from "../Loadingspinner"; // Adjust path if needed

function InfoBlock({ label, value }) {
  return (
    <div className="mb-4">
      <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{label}</span>
      <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[46px] break-words whitespace-pre-wrap">
        {value ? value : <span className="text-gray-400 italic">Not provided</span>}
      </div>
    </div>
  );
}

const PreviewCat = ({ id, setPreviewCat }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const themeColor = "text-[#284043]";

  useEffect(() => {
    if (!id) return;

    const fetchCategoryDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`);
        const result = await res.json();
console.log(res);

        if (res.ok) {
          setData(result.data || result.category || result);
        } else {
          setError(result.message || "Failed to load category details.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error. Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  const sectionHeaderClasses = "text-base font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2 flex items-center gap-2 mt-8 first:mt-0";

  return (
    // Fixed Background Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-fade-in-up">
        
        {/* Sticky Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#284043]/10 rounded-lg">
              <FaEye className={`text-xl ${themeColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Category Preview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Read-only view of the category details.</p>
            </div>
          </div>
          <button 
            onClick={() => setPreviewCat(false)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10 bg-[#fefefe]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <Spinner size="md" section="Category Engine" title="Loading Preview" message="Fetching category details…" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900">Oops!</h3>
              <p className="text-gray-500 mt-2">{error}</p>
            </div>
          ) : data ? (
            <div>
              {/* Basic Information */}
              <h3 className={sectionHeaderClasses}>Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-x-6">
                <InfoBlock label="Category Name" value={data.name} />
                <InfoBlock label="Slug" value={data.slug} />
                <div className="md:col-span-2">
                  <InfoBlock label="Description" value={data.description} />
                </div>
                <InfoBlock 
                  label="Status" 
                  value={
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      data.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'Unknown'}
                    </span>
                  } 
                />
              </div>

              {/* SEO Information */}
              <h3 className={sectionHeaderClasses}><FaSearch className="text-gray-400" /> SEO Information</h3>
              <div className="grid md:grid-cols-2 gap-x-6 bg-gray-50/50 p-5 rounded-xl border border-gray-100 mb-2">
                <InfoBlock label="Meta Title" value={data.metaTitle} />
                <InfoBlock label="Canonical URL" value={data.canonicalUrl} />
                <div className="md:col-span-2">
                  <InfoBlock label="Meta Description" value={data.metaDescription} />
                </div>
                <div className="md:col-span-2">
                  <InfoBlock label="Meta Keywords" value={data.metaKeywords} />
                </div>
              </div>

              {/* Open Graph */}
              <h3 className={sectionHeaderClasses}><FaGlobe className={themeColor} /> Open Graph (Facebook/LinkedIn)</h3>
              <div className="grid md:grid-cols-2 gap-x-6">
                <InfoBlock label="OG Title" value={data.ogTitle} />
                <InfoBlock label="OG Image URL" value={data.ogImage} />
                <div className="md:col-span-2">
                  <InfoBlock label="OG Description" value={data.ogDescription} />
                </div>
              </div>

              {/* Twitter */}
              <h3 className={sectionHeaderClasses}><FaTwitter className="text-[#1DA1F2]" /> Twitter Card</h3>
              <div className="grid md:grid-cols-2 gap-x-6 pb-4">
                <InfoBlock label="Twitter Title" value={data.twitterTitle} />
                <InfoBlock label="Twitter Image URL" value={data.twitterImage} />
                <div className="md:col-span-2">
                  <InfoBlock label="Twitter Description" value={data.twitterDescription} />
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">No data found.</div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl z-10">
          <button
            type="button"
            onClick={() => setPreviewCat(false)}
            className="px-8 py-2.5 text-sm text-white bg-[#284043] hover:bg-[#1d3032] font-semibold rounded-lg transition-all duration-200 shadow-sm shadow-[#284043]/20"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};

export default PreviewCat;
