"use client";

import { useRouter } from "next/navigation";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import Sidebar from "./Sidebar";

// Dummy admin user — no API call needed
const DUMMY_USER = { name: "Amar Admin" };

export default function Frame({ children }) {
  const router = useRouter();
  const baseurl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogout = async () => {
    try {
      // Backend ko bolo httpOnly cookies clear karne ke liye
      await fetch(`${baseurl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed, redirecting anyway:", err);
    } finally {
      document.cookie = "adminSession=; path=/; SameSite=Lax; Max-Age=0";
      document.cookie = "accessToken=; path=/; SameSite=Lax; Max-Age=0";
      document.cookie = "refreshToken=; path=/; SameSite=Lax; Max-Age=0";
      // API fail ho ya success, admin ko hamesha login page bhej do
      router.replace("/auth");
    }
  };

  const displayName = DUMMY_USER.name;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-gray-100 flex-shrink-0">
          <div className="relative w-72 sm:w-96">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search sections or content..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-[#d26c51] focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-[#235056] transition-colors" aria-label="Notifications">
              <FiBell className="text-2xl" />
            </button>

            <div className="h-8 w-px bg-gray-200"></div>

            <div className="text-sm font-medium text-[#235056] flex items-center gap-2">
              <span className="text-gray-400 font-normal">Welcome back, </span>
              {displayName}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={13} /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
