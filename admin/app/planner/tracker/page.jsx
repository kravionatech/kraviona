// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Frame from "@/components/Frame/Frame";
import PlannerNav from "@/components/planner/PlannerNav";
import TrackerTable from "@/components/planner/TrackerTable";
import ContentPlanForm from "@/components/planner/ContentPlanForm";
import { apiRequest } from "@/components/api";
import { Plus } from "lucide-react";

export default function ContentTrackerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamUsers, setTeamUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
    assignedTo: "",
    isOutdated: "",
  });

  // Modal form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiRequest("/users");
      if (res?.data || res?.users) {
        setTeamUsers(res.data || res.users || []);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const res = await apiRequest("/me");
      if (res?.user || res?.data) {
        setCurrentUser(res.user || res.data);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.type) params.set("type", filters.type);
      if (filters.assignedTo) params.set("assignedTo", filters.assignedTo);
      if (filters.isOutdated) params.set("isOutdated", filters.isOutdated);
      params.set("limit", "200");

      const res = await apiRequest(`/planner/items?${params.toString()}`);
      if (res?.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error("Failed to fetch tracker items:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
    fetchMe();
  }, [fetchUsers, fetchMe]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDeleteClick = async (itemId) => {
    if (!confirm("Are you sure you want to delete this planned task?")) return;
    try {
      await apiRequest(`/planner/items/${itemId}`, { method: "DELETE" });
      fetchItems();
    } catch (err) {
      alert(err.message || "Failed to delete task");
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  return (
    <Frame>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header & Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Content Status Tracker
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Full lifecycle audit: monitor indexing status, active drafts, and 90-day content decay.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#123f46] hover:bg-[#155761] px-4 py-2 text-xs font-semibold text-white shadow-md transition self-start sm:self-auto"
            >
              <Plus size={16} /> Add Content Item
            </button>
          </div>

          <PlannerNav />
        </div>

        {/* Tracker Table Component */}
        <TrackerTable
          items={items}
          loading={loading}
          teamUsers={teamUsers}
          filters={filters}
          onFilterChange={setFilters}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onItemUpdated={fetchItems}
          currentUserRole={currentUser?.role}
        />

        {/* Modal Form */}
        <ContentPlanForm
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          initialData={editingItem}
          onSaved={fetchItems}
          teamUsers={teamUsers}
        />
      </div>
    </Frame>
  );
}
