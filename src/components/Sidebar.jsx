import { useState } from "react";
import {
  MdDashboard,
  MdInventory2,
  MdApartment,
  MdBuild,
  MdReportProblem,
  MdViewInAr,
  MdBarChart,
  MdPeople,
  MdLogout,
  MdChevronRight,
} from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: MdDashboard },
  { id: "asset-management", label: "Asset Management", icon: MdInventory2 },
  { id: "asset-details", label: "Asset Details", icon: MdApartment },
  { id: "maintenance", label: "Maintenance Management", icon: MdBuild },
  { id: "issues", label: "Issue Management", icon: MdReportProblem },
  { id: "bim-viewer", label: "BIM Viewer", icon: MdViewInAr },
  { id: "analytics", label: "Analytics", icon: MdBarChart },
  { id: "users", label: "User Management", icon: MdPeople },
];

const statusDots = {
  dashboard: "bg-emerald-400",
  "bim-viewer": "bg-sky-400",
  analytics: "bg-violet-400",
};

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50"
      style={{
        width: "280px",
        background: "linear-gradient(180deg, #0f1623 0%, #111827 60%, #0d1420 100%)",
        borderRight: "1px solid rgba(99,102,241,0.15)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Building icon badge */}
        <div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{
            width: 42,
            height: 42,
            background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            boxShadow: "0 0 18px rgba(99,102,241,0.45)",
          }}
        >
          <HiBuildingOffice2 className="text-white" size={22} />
        </div>

        <div className="min-w-0">
          <p
            className="text-white font-semibold leading-tight tracking-tight truncate"
            style={{ fontSize: 14, letterSpacing: "-0.01em" }}
          >
            BIM Facility Manager
          </p>
          <p
            className="truncate mt-0.5"
            style={{ fontSize: 11, color: "#6b7a99", letterSpacing: "0.02em" }}
          >
            Smart Building Operations
          </p>
        </div>
      </div>

      {/* ── Nav label ── */}
      <p
        className="uppercase px-5 pt-5 pb-2"
        style={{ fontSize: 10, letterSpacing: "0.12em", color: "#3d4d6a", fontWeight: 700 }}
      >
        Navigation
      </p>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5 scrollbar-none">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeItem === id;
          const dot = statusDots[id];

          return (
            <button
              key={id}
              onClick={() => setActiveItem(id)}
              className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              style={{
                background: isActive
                  ? "linear-gradient(90deg, #4f46e5 0%, #5b54f0 100%)"
                  : "transparent",
                boxShadow: isActive ? "0 4px 14px rgba(79,70,229,0.35)" : "none",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Icon wrapper */}
              <span
                className="flex items-center justify-center rounded-lg shrink-0 transition-all duration-200"
                style={{
                  width: 32,
                  height: 32,
                  background: isActive
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(255,255,255,0.04)",
                }}
              >
                <Icon
                  size={17}
                  style={{
                    color: isActive ? "#ffffff" : "#5a6a8a",
                    transition: "color 0.2s",
                  }}
                  className={!isActive ? "group-hover:!text-indigo-400" : ""}
                />
              </span>

              {/* Label */}
              <span
                className="flex-1 text-sm font-medium truncate transition-colors duration-200"
                style={{
                  color: isActive ? "#ffffff" : "#8a9bbf",
                  fontSize: 13.5,
                }}
              >
                {label}
              </span>

              {/* Status dot or chevron */}
              {dot && !isActive ? (
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`}
                  style={{ opacity: 0.8 }}
                />
              ) : isActive ? (
                <MdChevronRight size={16} className="text-indigo-200 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 20px" }} />

      {/* ── User Profile ── */}
      <div className="px-4 py-4">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 cursor-pointer group"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center rounded-full shrink-0 font-bold text-white"
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
              fontSize: 14,
              boxShadow: "0 0 10px rgba(124,58,237,0.4)",
            }}
          >
            SA
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-white font-semibold truncate leading-tight"
              style={{ fontSize: 13 }}
            >
              System Administrator
            </p>
            <p style={{ fontSize: 11, color: "#6b7a99" }} className="mt-0.5">
              Admin
            </p>
          </div>

          {/* Logout */}
          <button
            className="flex items-center justify-center rounded-lg transition-all duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            title="Logout"
            style={{
              width: 30,
              height: 30,
              background: "rgba(255,255,255,0.05)",
              color: "#5a6a8a",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
              e.currentTarget.style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#5a6a8a";
            }}
          >
            <MdLogout size={16} />
          </button>
        </div>

        {/* Version tag */}
        <p
          className="text-center mt-3"
          style={{ fontSize: 10, color: "#2d3a52", letterSpacing: "0.08em" }}
        >
          BIM FM SUITE · v4.2.1
        </p>
      </div>
    </aside>
  );
}
