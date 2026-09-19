// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Frame from "@/components/Frame/Frame";
import PlannerNav from "@/components/planner/PlannerNav";
import KeywordTable from "@/components/planner/KeywordTable";
import { apiRequest } from "@/components/api";

export default function KeywordPlannerPage() {
  const [keywords, setKeywords] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamUsers, setTeamUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  const fetchKeywords = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/planner/keywords");
      if (res?.keywords) {
        setKeywords(res.keywords);
      }
      if (res?.clusters) {
        setClusters(res.clusters);
      }
    } catch (err) {
      console.error("Failed to fetch keywords:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchMe();
  }, [fetchUsers, fetchMe]);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  return (
    <Frame>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header & Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Keyword &amp; Topic Cluster Planner
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Research keywords, organize topical clusters, and convert keywords into editorial tasks.
              </p>
            </div>
          </div>

          <PlannerNav />
        </div>

        {/* Keyword Table Component */}
        <KeywordTable
          keywords={keywords}
          clusters={clusters}
          loading={loading}
          teamUsers={teamUsers}
          onRefresh={fetchKeywords}
          currentUserRole={currentUser?.role}
        />
      </div>
    </Frame>
  );
}
