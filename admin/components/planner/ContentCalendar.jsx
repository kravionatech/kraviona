// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  ListFilter,
  Layers,
} from "lucide-react";
import PlannerStats from "./PlannerStats";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ContentCalendar({
  month,
  year,
  onMonthChange,
  calendarData = {},
  stats = {},
  onDateClick,
  onNewTaskClick,
}) {
  const [viewMode, setViewMode] = useState("month"); // 'month' | 'week'
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);

  // Month navigation helpers
  const handlePrev = () => {
    if (viewMode === "month") {
      if (month === 1) {
        onMonthChange(12, year - 1);
      } else {
        onMonthChange(month - 1, year);
      }
    } else {
      // Prev week
      const current = selectedWeekStart || new Date(year, month - 1, 1);
      const prev = new Date(current);
      prev.setDate(prev.getDate() - 7);
      setSelectedWeekStart(prev);
      onMonthChange(prev.getMonth() + 1, prev.getFullYear());
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      if (month === 12) {
        onMonthChange(1, year + 1);
      } else {
        onMonthChange(month + 1, year);
      }
    } else {
      // Next week
      const current = selectedWeekStart || new Date(year, month - 1, 1);
      const next = new Date(current);
      next.setDate(next.getDate() + 7);
      setSelectedWeekStart(next);
      onMonthChange(next.getMonth() + 1, next.getFullYear());
    }
  };

  const handleToday = () => {
    const today = new Date();
    onMonthChange(today.getMonth() + 1, today.getFullYear());
    setSelectedWeekStart(today);
  };

  // Build 42 grid cells for month view
  const monthDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = lastDay.getDate();

    const cells = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 2, d);
      cells.push({
        date: prevDate,
        dateKey: prevDate.toISOString().split("T")[0],
        dayNumber: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const currDate = new Date(year, month - 1, d);
      cells.push({
        date: currDate,
        dateKey: currDate.toISOString().split("T")[0],
        dayNumber: d,
        isCurrentMonth: true,
      });
    }

    // Next month filler days to complete 35 or 42 grid
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month, d);
      cells.push({
        date: nextDate,
        dateKey: nextDate.toISOString().split("T")[0],
        dayNumber: d,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [month, year]);

  // Week days calculation
  const weekDays = useMemo(() => {
    const start = selectedWeekStart
      ? new Date(selectedWeekStart)
      : new Date(year, month - 1, 1);
    // Find Sunday of that week
    const sun = new Date(start);
    sun.setDate(start.getDate() - start.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sun);
      d.setDate(sun.getDate() + i);
      days.push({
        date: d,
        dateKey: d.toISOString().split("T")[0],
        dayNumber: d.getDate(),
        isCurrentMonth: d.getMonth() === month - 1,
      });
    }
    return days;
  }, [selectedWeekStart, month, year]);

  const monthName = new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
  });

  const todayKey = new Date().toISOString().split("T")[0];

  const displayedCells = viewMode === "month" ? monthDays : weekDays;

  return (
    <div className="space-y-6">
      {/* Monthly Completion Bar and Stats */}
      <PlannerStats stats={stats} monthName={monthName} year={year} />

      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1">
            <button
              type="button"
              onClick={handlePrev}
              className="rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition shadow-xs"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#123f46] transition"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition shadow-xs"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {monthName} {year}
          </h3>
        </div>

        {/* View Toggle (Month / Week) & Add Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={`rounded-lg px-3 py-1.5 transition ${
                viewMode === "month"
                  ? "bg-white dark:bg-slate-700 text-[#123f46] dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Month View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`rounded-lg px-3 py-1.5 transition ${
                viewMode === "week"
                  ? "bg-white dark:bg-slate-700 text-[#123f46] dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Week View
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNewTaskClick(todayKey)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#123f46] hover:bg-[#155761] px-4 py-2 text-xs font-semibold text-white shadow-md transition"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-center py-3">
          {WEEKDAYS.map((day, idx) => (
            <span
              key={day}
              className={`text-xs font-bold uppercase tracking-wider ${
                idx === 0 || idx === 6
                  ? "text-slate-400 dark:text-slate-500"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div
          className={`grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80 ${
            viewMode === "week" ? "min-h-[420px]" : "min-h-[640px]"
          }`}
        >
          {displayedCells.map((cell) => {
            const dayData = calendarData[cell.dateKey] || {
              tasks: [],
              totalTasks: 0,
              completedTasks: 0,
              completionPercentage: 0,
            };

            const isToday = cell.dateKey === todayKey;
            const hasTasks = dayData.tasks && dayData.tasks.length > 0;

            return (
              <div
                key={cell.dateKey}
                onClick={() => onDateClick(cell.dateKey, dayData)}
                className={`group relative flex flex-col justify-between p-2 sm:p-2.5 transition cursor-pointer select-none ${
                  !cell.isCurrentMonth
                    ? "bg-slate-50/50 dark:bg-slate-950/40 text-slate-400"
                    : "bg-white dark:bg-slate-900 hover:bg-[#155761]/5 dark:hover:bg-[#155761]/20"
                } ${isToday ? "ring-2 ring-inset ring-[#f7c56d]" : ""}`}
              >
                {/* Cell Top Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday
                        ? "bg-[#123f46] text-[#f7c56d] font-bold shadow-xs"
                        : cell.isCurrentMonth
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {/* Task count chip or completion % */}
                  {hasTasks && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                        dayData.completionPercentage === 100
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-[#123f46]/10 text-[#123f46] border-[#123f46]/20 dark:bg-[#f7c56d]/15 dark:text-[#f7c56d]"
                      }`}
                    >
                      {dayData.completedTasks}/{dayData.totalTasks} (
                      {dayData.completionPercentage}%)
                    </span>
                  )}
                </div>

                {/* Tasks preview & status dots */}
                <div className="my-2 space-y-1 overflow-hidden">
                  {hasTasks ? (
                    dayData.tasks.slice(0, 3).map((task) => {
                      let dotColor = "bg-slate-400";
                      if (task.status === "In Progress")
                        dotColor = "bg-amber-500";
                      else if (task.status === "Done")
                        dotColor = "bg-blue-500";
                      else if (task.status === "Published")
                        dotColor = "bg-teal-500";
                      else if (task.status === "Indexed")
                        dotColor = "bg-emerald-500";
                      else if (task.status === "Needs Update")
                        dotColor = "bg-rose-500";

                      return (
                        <div
                          key={task._id}
                          className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 truncate"
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
                          />
                          <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                            {task.title}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-6" />
                  )}

                  {hasTasks && dayData.tasks.length > 3 && (
                    <div className="text-[10px] font-semibold text-slate-400 pl-1">
                      +{dayData.tasks.length - 3} more
                    </div>
                  )}
                </div>

                {/* Hover Quick Add Action */}
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">View tasks</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewTaskClick(cell.dateKey);
                    }}
                    className="rounded p-0.5 text-slate-500 hover:text-[#123f46] dark:hover:text-[#f7c56d] transition"
                    title="Add task on this date"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
