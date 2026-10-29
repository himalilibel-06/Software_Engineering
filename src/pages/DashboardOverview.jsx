import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import {
  FiActivity, FiBox, FiAlertTriangle, FiCalendar, 
  FiTrendingUp, FiCheckCircle, FiClock, FiGrid, FiRefreshCw
} from "react-icons/fi";

// ─── Component Elements ────────────────────────────────────────────────────────

const KpiCard = ({ icon: Icon, label, value, color, lightColor, subtitle }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-all">
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${lightColor} flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1 leading-none">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>}
    </div>
  </div>
);

const CategoryRow = ({ category, count, max }) => {
  const percentage = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-gray-700">{category}</span>
        <span className="font-mono bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-bold">{count} Active</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div 
          className="bg-red-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeIssuesCount: 0,
    maintenanceToday: 0,
    breakdown: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalAssets: data.totalAssets ?? 0,
          activeIssuesCount: data.activeIssuesCount ?? data.activeIssues ?? 0,
          maintenanceToday: data.maintenanceToday ?? 0,
          breakdown: data.breakdown || {}
        });
      } else {
        console.warn("Could not fetch dashboard stats, status:", res.status);
      }
    } catch (err) {
      console.error("Error loading centralized dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center space-y-3">
          <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500">Compiling multi-collection infrastructure telemetry...</p>
        </div>
      </div>
    );
  }

  // Find the highest breakdown count to normalize the progress bar lengths
  const breakdown = stats.breakdown || {};
  const counts = Object.values(breakdown);
  const maxIssues = counts.length > 0 ? Math.max(...counts) : 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ── Page Header Layout ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Overview</h1>
            <p className="mt-1 text-sm text-gray-500">Live operational cross-section summary of database operations.</p>
          </div>
          <button 
            onClick={fetchDashboardStats}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors shadow-sm focus:outline-none"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh Hub
          </button>
        </div>

        {/* ── Cross-Collection Metric Counters ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <KpiCard icon={FiBox}           label="Total Hardware Assets" value={stats.totalAssets}       color="text-blue-600"   lightColor="bg-blue-50"   subtitle="Active registered track records" />
          <KpiCard icon={FiAlertTriangle} label="Active Urgent Issues"  value={stats.activeIssuesCount} color="text-red-600"    lightColor="bg-red-50"    subtitle="Awaiting resolution workflow" />
          <KpiCard icon={FiCalendar}      label="Due Today Tasks"       value={stats.maintenanceToday}  color="text-amber-600"  lightColor="bg-amber-50"  subtitle="Preventative runs scheduled" />
          <KpiCard icon={FiActivity}      label="Operational Index"     value={stats.activeIssuesCount === 0 ? "100%" : "Stable"} color="text-green-600"  lightColor="bg-green-50" subtitle="General system health factor" />
        </div>

        {/* ── Analytical Insights Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Defect Category Density Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiTrendingUp className="text-red-500 w-5 h-5" />
                Active Breakdown Density
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Distribution map of open incidents relative to building domains.</p>
            </div>
            
            <div className="space-y-4">
              {Object.keys(stats.breakdown).length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400">
                  No active incidents recorded. Facility operations running smoothly!
                </div>
              ) : (
                Object.entries(stats.breakdown).map(([category, count]) => (
                  <CategoryRow key={category} category={category} count={count} max={maxIssues} />
                ))
              )}
            </div>
          </div>

          {/* Core System Entry Gateways */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiGrid className="text-blue-500 w-5 h-5" />
                Quick Navigation
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Direct entry keys to main facility control ledgers.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Incident Work Desk", desc: "Track emergency repair updates", path: "/issues", text: "text-red-600", bg: "bg-red-50" },
                { label: "Hardware Inventory", desc: "Manage facility hardware assets", path: "/assets", text: "text-blue-600", bg: "bg-blue-50" },
                { label: "Routine Scheduler",  desc: "Plan preventative compliance", path: "/maintenance", text: "text-amber-600", bg: "bg-amber-50" }
              ].map(link => (
                <a 
                  key={link.label}
                  href={link.path}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all group"
                >
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{link.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                  </div>
                  <span className={`w-8 h-8 rounded-lg ${link.bg} ${link.text} flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform`}>
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}