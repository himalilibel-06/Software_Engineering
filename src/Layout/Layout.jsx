import { useState } from "react";
import Sidebar from "../components/Sidebar";

// ─── Icon primitives ────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon({ hasDot }) {
  return (
    <span className="relative">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {hasDot && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
      )}
    </span>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Breadcrumb({ items = [] }) {
  const crumbs = [{ label: "Home", icon: true }, ...items];
  return (
    <nav className="flex items-center gap-1 mt-0.5" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <span className="text-slate-300">
              <ChevronRight />
            </span>
          )}
          <span
            className={`flex items-center gap-1 text-xs font-medium transition-colors ${
              i === crumbs.length - 1
                ? "text-slate-500 cursor-default"
                : "text-slate-400 hover:text-blue-600 cursor-pointer"
            }`}
          >
            {crumb.icon && <HomeIcon />}
            {crumb.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

function SearchBar() {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-slate-400 transition-all duration-150 bg-white ${
        focused
          ? "border-blue-500 ring-2 ring-blue-100 text-slate-600 w-64"
          : "border-slate-200 hover:border-slate-300 w-52"
      }`}
    >
      <SearchIcon />
      <input
        type="text"
        placeholder="Search assets, work orders…"
        className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {!focused && (
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-slate-200 text-slate-400 shrink-0">
          ⌘K
        </span>
      )}
    </div>
  );
}

function NotificationButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 shadow-sm"
        aria-label="Notifications"
      >
        <BellIcon hasDot={true} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-800">Notifications</span>
              <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">Mark all read</span>
            </div>
            {[
              { label: "PM-2041 overdue", sub: "HVAC Unit B · 2 hrs ago", dot: "bg-red-500" },
              { label: "Asset #A-0918 flagged", sub: "Chiller Plant · 4 hrs ago", dot: "bg-amber-400" },
              { label: "BIM sync complete", sub: "Building 4 · Yesterday", dot: "bg-emerald-500" },
            ].map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                <div>
                  <p className="text-sm font-medium text-slate-800">{n.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.sub}</p>
                </div>
              </div>
            ))}
            <div className="px-4 py-2.5 text-center">
              <span className="text-xs font-medium text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                View all notifications
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function UserAvatar({ name = "Alex Morgan", role = "Facility Manager" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all duration-150 shadow-sm group"
        aria-label="User menu"
      >
        <span className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold tracking-wide">
          {initials}
        </span>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{name}</p>
          <p className="text-[10px] text-slate-400 leading-tight">{role}</p>
        </div>
        <svg className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-20 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">{name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{role}</p>
            </div>
            {["Profile & Settings", "My Work Orders", "Preferences", "Help & Docs"].map((item) => (
              <div key={item} className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 cursor-pointer transition-colors">
                {item}
              </div>
            ))}
            <div className="border-t border-slate-100">
              <div className="px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
                Sign out
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Header({ title = "Dashboard", breadcrumb = [] }) {
  return (
    <header className="h-[60px] flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 z-10">
      {/* Left: Title + Breadcrumb */}
      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-[15px] font-semibold text-slate-900 leading-tight tracking-tight truncate">
          {title}
        </h1>
        <Breadcrumb items={breadcrumb} />
      </div>

      {/* Right: Search, Notifications, Avatar */}
      <div className="flex items-center gap-2.5 shrink-0 ml-4">
        <SearchBar />
        <NotificationButton />
        <div className="w-px h-6 bg-slate-200 mx-0.5" />
        <UserAvatar />
      </div>
    </header>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────

/**
 * Layout — root shell for the BIM Facility Management System.
 *
 * Props:
 *   children      — page content rendered in the main content area
 *   title         — page title shown in the header (default: "Dashboard")
 *   breadcrumb    — array of { label } objects for the breadcrumb trail
 *
 * Usage:
 *   <Layout title="Asset Registry" breadcrumb={[{ label: "Assets" }, { label: "HVAC" }]}>
 *     <YourPageContent />
 *   </Layout>
 */
export default function Layout({
  children,
  title = "Dashboard",
  breadcrumb = [],
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans antialiased">

      {/* ── Sidebar ── fixed 280px */}
      <aside
        className="shrink-0 h-full border-r border-slate-200 bg-white shadow-sm z-20"
        style={{ width: "280px" }}
      >
        <Sidebar />
      </aside>

      {/* ── Right panel: Header + Content ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

        {/* Header */}
        <Header title={title} breadcrumb={breadcrumb} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 min-h-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
