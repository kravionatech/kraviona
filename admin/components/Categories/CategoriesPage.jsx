"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2"; // Make sure you have this installed
import Link from "next/link";
import PreviewCat from "./PreviewCat";
import EditCategory from "./EditCategory";

/* ----------------------------------------------------------------------
 * KRAVIONA — Admin · Categories 
 * Matches the layout style of the "Manage Posts" page
 * Stack: React + Tailwind (core utilities only) + lucide-react
 * ------------------------------------------------------------------- */

// --- Theme Colors ---
const BRAND = "#235056"; // Dark teal from your sidebar/buttons
const ACCENT = "#d26c51"; // Red accent for the tiny dash

/* ------------------------------ Components --------------------------------- */

// 1. Metric Card (Matches the top 4 cards in the screenshot)
function MetricCard({ title, count, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl font-bold text-slate-900">{count}</div>
        <div className="text-xs font-medium text-slate-500">
          <span className="font-semibold text-slate-700">{title}</span>
          {subtitle && <span className="ml-1 text-slate-400">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}

// 2. Status Badge (Matches the outline badges in the screenshot)
function StatusBadge({ status }) {
  const s = status?.toLowerCase() || "";
  
  if (s === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Published
      </span>
    );
  }
  
  if (s === "draft") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock className="h-3.5 w-3.5" />
        Draft
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
      <Archive className="h-3.5 w-3.5" />
      Archived
    </span>
  );
}

// 3. Sortable Header
function SortHeader({ label, align = "left" }) {
  return (
    <th className={`px-5 py-3 text-${align} text-[11px] font-bold uppercase tracking-wider text-slate-400`}>
      <div className={`flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
        {label}
        <ChevronsUpDown className="h-3 w-3 text-slate-300" />
      </div>
    </th>
  );
}

/* --------------------------- Main Page ----------------------------- */

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [prevCatID,setPrevCatID]= useState('')
  const [prevCat,setPrevCat]=useState(false)

  const [editID, setEditID] = useState('');
  const [editOpen, setEditOpen] = useState(false);


  // Fetch from Real API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/all`,
        {
          method: "GET",
          credentials: "include", // Required if relying on HTTPOnly Cookies
        }
      );
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data || []);
      } else {
        throw new Error(result.message || "Failed to load categories.");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not fetch categories from the server.",
        confirmButtonColor: BRAND,
      });
    } finally {
      setLoading(false);
    }
  }, []);


const deleteCategory = async (id) => {
  try {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/category/${id}`,
      {
        method: "DELETE",
        credentials: "include", 
      }
    );
    
    const result = await response.json();

    if (response.ok && result.success !== false) {
      
      setCategories((prev) => prev.filter((category) => category._id !== id));


      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The category has been deleted successfully.",
        confirmButtonColor: BRAND,
      });

    } else {
      throw new Error(result.message || "Failed to delete the category.");
    }
  } catch (err) {
    console.error("Delete category error:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message || "Could not delete the category from the server.",
      confirmButtonColor: BRAND,
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timeout = setTimeout(fetchCategories, 0);
    return () => clearTimeout(timeout);
  }, [fetchCategories]);

  // Calculate Metrics safely from real data
  const totalCategories = categories.length;
  const publishedCount = categories.filter((c) => c.status?.toLowerCase() === "published").length;
  const draftCount = categories.filter((c) => c.status?.toLowerCase() === "draft").length;
  const archivedCount = categories.filter((c) => c.status?.toLowerCase() === "archived").length;
  const totalTaggedPosts = categories.reduce((sum, c) => sum + (c.postCount || 0), 0);

  // Filter Data
  const displayCategories = categories.filter((c) => {
    if (statusFilter === "All") return true;
    return c.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <>
    <div className="w-full bg-[#fcfcfc] p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* --- Header Section --- */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Blog Engine
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Categories</h1>
          </div>
          <Link href={"/category/new"}>
          <button
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND }}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add category
          </button></Link>
        </div>

        {/* --- Metric Cards --- */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            count={loading ? "-" : totalCategories} 
            title="Total categories" 
            icon={FileText} 
            colorClass="bg-slate-100 text-slate-600" 
          />
          <MetricCard 
            count={loading ? "-" : publishedCount} 
            title="Published" 
            icon={CheckCircle2} 
            colorClass="bg-emerald-50 text-emerald-600" 
          />
          <MetricCard 
            count={loading ? "-" : draftCount} 
            title="Drafts" 
            icon={Clock} 
            colorClass="bg-amber-50 text-amber-600" 
          />
          <MetricCard 
            count={loading ? "-" : totalTaggedPosts} 
            title="Total posts" 
            subtitle="tagged"
            icon={Eye} 
            colorClass="bg-sky-50 text-sky-600" 
          />
        </div>

        {/* --- Toolbar (Search & Filters) --- */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, slug..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-shadow focus:border-[#235056] focus:ring-1 focus:ring-[#235056]"
            />
          </div>

          {/* Filter Segment Control */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {[
              { label: "All", count: totalCategories },
              { label: "Published", count: publishedCount },
              { label: "Draft", count: draftCount },
              { label: "Archived", count: archivedCount },
            ].map((tab) => {
              const isActive = statusFilter === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setStatusFilter(tab.label)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                  <span className={`text-[11px] ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                    {loading ? "-" : tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Table --- */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-slate-100 bg-white">
                <tr>
                  <SortHeader label="Name" />
                  <SortHeader label="Status" />
                  <SortHeader label="Posts" align="center" />
                  <SortHeader label="Date" />
                  <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                        <span>Loading categories...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      No categories found for &quot;{statusFilter}&quot;.
                    </td>
                  </tr>
                ) : (
                  displayCategories.map((category) => (
                    <tr key={category._id} className="transition-colors hover:bg-slate-50/70 group">
                      
                      {/* Name & Slug Column */}
                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-900">{category.name}</div>
                        <div className="mt-0.5 text-xs text-slate-400">/{category.slug}</div>
                      </td>

                      {/* Status Column */}
                      <td className="px-5 py-3">
                        <StatusBadge status={category.status} />
                      </td>

                      {/* Posts Count Column */}
                      <td className="px-5 py-3 text-center">
                        <span className="font-semibold text-slate-700">{category.postCount || 0}</span>
                      </td>

                      {/* Date Column */}
                      <td className="px-5 py-3 text-slate-500">
                        {new Date(category.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      {/* Actions Column */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1 text-slate-400">
                          <button className="rounded-md p-1.5 transition-colors hover:bg-slate-100 hover:text-slate-700">
                            <Eye onClick={()=>{
                               setPrevCatID(category._id)


                              setPrevCat(true)
                            }} className="h-4 w-4" />
                          </button>
                          <button className="rounded-md p-1.5 transition-colors hover:bg-slate-100 hover:text-[#235056]">
                            <Pencil onClick={()=>{
                              setEditID(category._id);
                              setEditOpen(true);
                            }} className="h-4 w-4" />
                          </button>
                          <button onClick={()=>{
                            deleteCategory(category._id)
                          }} className="rounded-md p-1.5 transition-colors hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    {
      prevCat && <PreviewCat
      id={prevCatID} setPreviewCat={setPrevCat}/>
    }

    {editOpen && <EditCategory id={editID} setEditPageOpen={setEditOpen} />}

    </>
  );
}
