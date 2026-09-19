// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Frame from "@/components/Frame/Frame";
import PlannerNav from "@/components/planner/PlannerNav";
import ContentCalendar from "@/components/planner/ContentCalendar";
import DayDetailPanel from "@/components/planner/DayDetailPanel";
import ContentPlanForm from "@/components/planner/ContentPlanForm";
import { apiRequest } from "@/components/api";
import { Loader2 } from "lucide-react";

export default function PlannerPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [calendarData, setCalendarData] = useState({});
  const [stats, setStats] = useState({});
  const [teamUsers, setTeamUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Day panel state
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayPanelOpen, setDayPanelOpen] = useState(false);

  // Form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formDefaultDate, setFormDefaultDate] = useState(null);

  // Fetch users for assignees
  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiRequest("/users");
      if (res?.data || res?.users) {
        setTeamUsers(res.data || res.users || []);
      }
    } catch (e) {
      // Users fallback
    }
  }, []);

  // Fetch current user
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

  // Fetch calendar items and monthly stats
  const fetchCalendar = useCallback(async () => {
    try {
      setLoading(true);
      const [calRes, statsRes] = await Promise.all([
        apiRequest(`/planner/items/calendar?month=${month}&year=${year}`),
        apiRequest(`/planner/items/stats?month=${month}&year=${year}`),
      ]);

      if (calRes?.data?.calendarDays) {
        setCalendarData(calRes.data.calendarDays);
      }
      if (statsRes?.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error("Failed to load planner data:", err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchUsers();
    fetchMe();
  }, [fetchUsers, fetchMe]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleDateClick = (dateKey) => {
    setSelectedDate(dateKey);
    setDayPanelOpen(true);
  };

  const handleNewTaskClick = (dateKey) => {
    setEditingItem(null);
    setFormDefaultDate(dateKey || new Date().toISOString().split("T")[0]);
    setFormOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDeleteClick = async (itemId) => {
    if (!confirm("Are you sure you want to delete this planned task?")) return;
    try {
      await apiRequest(`/planner/items/${itemId}`, { method: "DELETE" });
      fetchCalendar();
    } catch (err) {
      alert(err.message || "Failed to delete task");
    }
  };

  const handleItemSaved = () => {
    fetchCalendar();
  };

  const activeDayData = selectedDate ? calendarData[selectedDate] : null;

  return (
    <Frame>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Planner Header & Navigation */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Content Planner &amp; Editorial Calendar
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Plan, assign, and track publishing schedules across all content channels.
              </p>
            </div>
          </div>

          <PlannerNav />
        </div>

        {/* Calendar Main Grid */}
        {loading && Object.keys(calendarData).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 size={32} className="animate-spin text-[#123f46] mb-3" />
            <p className="text-sm font-medium">Loading Editorial Calendar...</p>
          </div>
        ) : (
          <ContentCalendar
            month={month}
            year={year}
            onMonthChange={handleMonthChange}
            calendarData={calendarData}
            stats={stats}
            onDateClick={handleDateClick}
            onNewTaskClick={handleNewTaskClick}
          />
        )}

        {/* Day Detail Sidebar */}
        <DayDetailPanel
          isOpen={dayPanelOpen}
          onClose={() => setDayPanelOpen(false)}
          selectedDate={selectedDate}
          dayData={activeDayData}
          onItemUpdated={handleItemSaved}
          onAddNewClick={handleNewTaskClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          currentUserRole={currentUser?.role}
        />

        {/* Content Plan Form Modal */}
        <ContentPlanForm
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          initialData={editingItem}
          onSaved={handleItemSaved}
          defaultDate={formDefaultDate}
          teamUsers={teamUsers}
        />
      </div>
    </Frame>
  );
}
