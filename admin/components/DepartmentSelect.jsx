"use client";

import { useMemo, useState } from "react";

const DEFAULT_DEPARTMENTS = [
  "General",
  "Administration",
  "Content",
  "Design",
  "Development",
  "Digital Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Sales",
  "Support",
];

const NEW_DEPARTMENT = "__new_department__";

export default function DepartmentSelect({ value, onChange, departments = [], required = false }) {
  const [addingNew, setAddingNew] = useState(false);
  const options = useMemo(() => {
    const seen = new Set();
    return [...DEFAULT_DEPARTMENTS, ...departments, value]
      .map((item) => String(item || "").trim())
      .filter((item) => {
        const key = item.toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [departments, value]);

  const selectValue = addingNew ? NEW_DEPARTMENT : value || "";

  return (
    <div className="space-y-2">
      <select
        value={selectValue}
        required={required && !addingNew}
        onChange={(event) => {
          if (event.target.value === NEW_DEPARTMENT) {
            setAddingNew(true);
            onChange("");
            return;
          }
          setAddingNew(false);
          onChange(event.target.value);
        }}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/10"
      >
        <option value="">Select department</option>
        {options.map((department) => <option key={department.toLowerCase()} value={department}>{department}</option>)}
        <option value={NEW_DEPARTMENT}>+ Add new department</option>
      </select>
      {addingNew && (
        <input
          autoFocus
          required={required}
          value={value}
          maxLength={80}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter new department name"
          className="w-full rounded-lg border border-[#235056]/30 bg-[#f4f8f7] px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/10"
        />
      )}
      <p className="text-xs text-slate-500">Choose an existing department or add a new one.</p>
    </div>
  );
}
