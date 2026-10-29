import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getApiBaseUrl } from "../lib/api";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  MdDashboard, MdCategory, MdBuild, MdWarning, MdViewInAr,
  MdBarChart, MdPeople, MdSettings, MdSearch, MdNotifications,
  MdTrendingUp, MdTrendingDown, MdCheckCircle, MdSchedule, MdError, MdMenu, MdClose
} from "react-icons/md";

const navItems = [
  { label: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  { label: "Assets", icon: MdCategory, path: "/assets" },
  { label: "Maintenance", icon: MdBuild, path: "/maintenance" },
  { label: "Issues", icon: MdWarning, path: "/issues" },
  { label: "BIM Viewer", icon: MdViewInAr, path: "/bim-viewer" },
  { label: "Analytics", icon: MdBarChart, path: "/analytics" },
  { label: "Users", icon: MdPeople, path: "/users" },
  { label: "Settings", icon: MdSettings, path: "/settings" },
];

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    completed: { label: "Completed", cls: "bg-emerald-100 text-emerald-700", icon: MdCheckCircle },
    open: { label: "Open", cls: "bg-blue-100 text-blue-700", icon: MdCheckCircle },
    scheduled: { label: "Scheduled", cls: "bg-purple-100 text-purple-700", icon: MdSchedule },
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700", icon: MdSchedule },
    critical: { label: "Critical", cls: "bg-red-100 text-red-700", icon: MdError },
  };
  const { label, cls, icon: Icon } = map[status] || map.open;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      <Icon className="text-sm" />{label}
    </span>
  );
}

const CustomTooltipCost = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "planned" ? "Planned" : "Unplanned"}: ${(p.value / 1000).toFixed(1)}k
        </p>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [issues, setIssues] = useState([]);
  const [assets, setAssets] = useState([]);
  const [maintenanceOrders, setMaintenanceOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const getProfilePic = () => {
    const rawPic = user?.profilePic || user?.avatar || user?.profileImage || user?.photo || user?.image || user?.profilePhoto || user?.imageUrl;
    if (!rawPic) return null;
    if (rawPic.startsWith('http') || rawPic.startsWith('data:')) {
      return rawPic;
    }
    return `${getApiBaseUrl()}${rawPic.startsWith('/') ? '' : '/'}${rawPic}`;
  };
 
  useEffect(() => {
    Promise.all([
      apiFetch("/api/assets").then((res) => res.json()),
      apiFetch("/api/maintenance").then((res) => res.json()),
      apiFetch("/api/issues").then((res) => res.json())
    ])
      .then(([assetsData, maintenanceData, issuesData]) => {
        setAssets(Array.isArray(assetsData) ? assetsData : []);
        setMaintenanceOrders(Array.isArray(maintenanceData) ? maintenanceData : []);
        setIssues(Array.isArray(issuesData) ? issuesData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard telemetry:", err);
        setLoading(false);
      });
  }, []);

  const totalAssetsCount = assets.length;
  const totalMaintenanceCount = maintenanceOrders.length;

  const totalHealthScore = assets.reduce((acc, curr) => acc + (curr.health || 0), 0);
  const averageHealthScore = totalAssetsCount > 0 ? Math.round(totalHealthScore / totalAssetsCount) : 0;

  let activeIssuesCount = issues.filter(
    (issue) => issue.status && issue.status.toLowerCase() !== "resolved" && issue.status.toLowerCase() !== "closed"
  ).length;

  let operationalCount = 0;
  let underMaintenanceCount = 0;
  let criticalStatusCount = 0;

  let priorityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  const floorMap = {};

  assets.forEach((asset) => {
    const status = asset.status || "Operational";
    const health = asset.health || 100;
    const floor = asset.location || "L1";

    if (status === "Critical") {
      criticalStatusCount++;
      activeIssuesCount++;
      priorityCounts.Critical++;
    } else if (status === "Maintenance") {
      underMaintenanceCount++;
      priorityCounts.Medium++;
    } else {
      operationalCount++;
    }

    if (health < 70 && status !== "Critical") priorityCounts.High++;
    if (health >= 70 && health < 90 && status !== "Maintenance") priorityCounts.Medium++;
    if (health >= 90) priorityCounts.Low++;

    if (!floorMap[floor]) {
      floorMap[floor] = { floor, healthy: 0, warning: 0, critical: 0 };
    }
    if (health >= 85) floorMap[floor].healthy++;
    else if (health >= 60) floorMap[floor].warning++;
    else floorMap[floor].critical++;
  });

  const assetHealthData = Object.values(floorMap).sort((a, b) => a.floor.localeCompare(b.floor));
  
  // Real dynamic data without hardcoded floor fallback
  const formattedHealthData = assetHealthData;

  // Real dynamic calculation for Maintenance Spend trend from maintenanceOrders
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const maintenanceCostData = monthNames.slice(0, 7).map((month, index) => {
    const planned = maintenanceOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt || order.date);
        return orderDate.getMonth() === index && order.type?.toLowerCase() === "planned";
      })
      .reduce((sum, order) => sum + (Number(order.cost) || 0), 0);

    const unplanned = maintenanceOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt || order.date);
        return orderDate.getMonth() === index && order.type?.toLowerCase() === "unplanned";
      })
      .reduce((sum, order) => sum + (Number(order.cost) || 0), 0);

    return { month, planned, unplanned };
  });

  const dynamicRecentActivities = [...assets]
    .reverse()
    .map((asset) => ({
      id: asset.assetId || asset._id?.substring(18).toUpperCase() || "UNKNOWN",
      name: asset.name || "Asset",
      activity: `${asset.name || 'Asset'} Status Synced`,
      user: "System Stream",
      date: asset.updatedAt ? new Date(asset.updatedAt).toISOString().split('T')[0] : "2026-06-19",
      status: asset.status === "Critical" ? "critical" : 
              asset.status === "Maintenance" ? "pending" : "completed"
    }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const filteredActivities = dynamicRecentActivities
    .filter((activity) => 
      activity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 6);

  const issuesByPriorityData = [
    { name: "Critical", value: priorityCounts.Critical, color: "#ef4444" },
    { name: "High", value: priorityCounts.High, color: "#f97316" },
    { name: "Medium", value: priorityCounts.Medium, color: "#eab308" },
    { name: "Low", value: priorityCounts.Low, color: "#3b82f6" },
  ];

  const pctOperational = totalAssetsCount > 0 ? Math.round((operationalCount / totalAssetsCount) * 100) : 0;
  const pctMaintenance = totalAssetsCount > 0 ? Math.round((underMaintenanceCount / totalAssetsCount) * 100) : 0;
  const pctCritical = totalAssetsCount > 0 ? Math.round((criticalStatusCount / totalAssetsCount) * 100) : 0;

  const assetStatusData = [
    { label: "Operational", value: pctOperational, color: "bg-emerald-500" },
    { label: "Under Maintenance", value: pctMaintenance, color: "bg-amber-400" },
    { label: "Critical", value: pctCritical, color: "bg-red-500" },
  ];

  const kpiCards = [
    { title: "Total Assets", value: totalAssetsCount.toLocaleString(), trend: "+12%", up: true, icon: MdCategory, light: "bg-blue-50", iconColor: "text-blue-600", path: "/assets" },
    { title: "Active Issues", value: activeIssuesCount.toString(), trend: "-8%", up: false, icon: MdWarning, light: "bg-red-50", iconColor: "text-red-500", path: "/issues" },
    { title: "Maintenance Tasks", value: totalMaintenanceCount.toLocaleString(), trend: "+15%", up: true, icon: MdBuild, light: "bg-amber-50", iconColor: "text-amber-500", path: "/maintenance" },
    { title: "Asset Health Score", value: `${averageHealthScore}%`, trend: "+3%", up: true, icon: MdBarChart, light: "bg-emerald-50", iconColor: "text-emerald-600", path: "/analytics" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white font-medium">
        Loading live BIM system diagnostics...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 flex flex-col transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-700/60 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <MdViewInAr className="text-white text-lg" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">BIM Facilities</p>
            <p className="text-slate-400 text-[10px] leading-tight tracking-wide uppercase">Asset Management</p>
          </div>
          <button className="ml-auto text-slate-400 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <MdClose className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Main</p>
          {navItems.slice(0, 5).map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => { setActiveNav(label); setSidebarOpen(false); navigate(path); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${activeNav === label ? "bg-blue-600 text-white shadow-md shadow-blue-900/30" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
            >
              <Icon className="text-lg shrink-0" />{label}
            </button>
          ))}
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mt-4 mb-2">System</p>
          {navItems.slice(5).map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => { setActiveNav(label); setSidebarOpen(false); navigate(path); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${activeNav === label ? "bg-blue-600 text-white shadow-md shadow-blue-900/30" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
            >
              <Icon className="text-lg shrink-0" />{label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-700/60 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
              {getProfilePic() ? (
                <img src={getProfilePic()} alt={user?.fullName || "User"} className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.fullName || "User"}</p>
              <p className="text-slate-400 text-xs truncate">{user?.role || "Facility Manager"}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6 shrink-0">
          <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(true)}>
            <MdMenu className="text-2xl" />
          </button>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {getGreeting()}, {user?.fullName} 
            </h2>
            <p className="text-sm text-slate-500">{currentDate}</p>
          </div>

          <div className="relative flex-1 max-w-sm ml-auto sm:ml-0">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recent assets..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <div className="relative ml-auto">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 transition-colors overflow-hidden">
              {getProfilePic() ? (
                <img src={getProfilePic()} alt={user?.fullName || "User"} className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase() || "U"
              )}
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50">
                <div className="border-b border-slate-100 pb-3 mb-3">
                  <p className="font-bold text-slate-800">{user?.fullName || "User"}</p>
                  <p className="text-xs text-slate-500">{user?.email || "user@example.com"}</p>
                </div>
                <div className="space-y-2">
                  <button onClick={() => { setIsMenuOpen(false); navigate("/profile"); }} className="w-full text-left text-sm text-slate-700 hover:bg-slate-50 p-2 rounded transition-colors">
                    View Profile
                  </button>
                  <button onClick={() => { localStorage.clear(); navigate("/"); }} className="w-full text-left text-sm text-red-600 hover:bg-red-50 p-2 rounded transition-colors font-medium">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Facility Overview</h1>
            <p className="text-slate-500 text-sm mt-0.5">Real-time asset intelligence across all building systems</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpiCards.map(({ title, value, trend, up, icon: Icon, light, iconColor, path }) => (
              <div key={title} onClick={() => navigate(path)} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl ${light} flex items-center justify-center`}>
                    <Icon className={`text-2xl ${iconColor}`} />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                    {up ? <MdTrendingUp /> : <MdTrendingDown />}{trend}
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
                <p className="mt-1 text-sm text-slate-500 font-medium">{title}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-1">Asset Health by Floor</h2>
              <p className="text-xs text-slate-400 mb-4">% distribution per building level</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={formattedHealthData} barSize={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="floor" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Bar dataKey="healthy" stackId="a" fill="#10b981" />
                  <Bar dataKey="warning" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="critical" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center">
                {[["#10b981", "Healthy"], ["#f59e0b", "Warning"], ["#ef4444", "Critical"]].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-1">Maintenance Cost Trend</h2>
              <p className="text-xs text-slate-400 mb-4">Planned vs unplanned spend (USD)</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={maintenanceCostData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltipCost />} />
                  <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: "#3b82f6" }} />
                  <Line type="monotone" dataKey="unplanned" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: "#ef4444" }} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center">
                {[["#3b82f6", "Planned"], ["#ef4444", "Unplanned"]].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-1">Open Issues by Priority</h2>
              <p className="text-xs text-slate-400 mb-4">{activeIssuesCount} total active issues</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={issuesByPriorityData} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value">
                    {issuesByPriorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                {issuesByPriorityData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: color }} />{name}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">Recent Activities</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Latest work orders and events</p>
                </div>
                <button className="text-xs text-blue-600 font-medium hover:underline">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      {["Asset ID", "Activity", "User", "Date", "Status"].map((h) => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map(({ id, activity, user, date, status }) => (
                        <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-blue-700 bg-blue-50/40 whitespace-nowrap">{id}</td>
                          <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">{activity}</td>
                          <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{user}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">{date}</td>
                          <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={status} /></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-sm text-slate-400">No matching activities found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-1">Asset Status Overview</h2>
                <p className="text-xs text-slate-400 mb-4">Portfolio health at a glance</p>
                <div className="space-y-4">
                  {assetStatusData.map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-slate-600">{label}</span>
                        <span className="text-xs font-bold text-slate-800">{value}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Total", value: totalAssetsCount.toLocaleString(), cls: "text-slate-800" },
                  { label: "Online", value: operationalCount.toLocaleString(), cls: "text-emerald-600" },
                  { label: "Offline", value: criticalStatusCount.toLocaleString(), cls: "text-red-500" },
                ].map(({ label, value, cls }) => (
                  <div key={label}>
                    <p className={`text-lg font-bold ${cls}`}>{value}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}