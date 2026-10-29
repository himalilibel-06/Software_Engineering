import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import * as FiIcons from "react-icons/fi";
import {
  FiDownload, FiFileText, FiCalendar,
  FiActivity, FiBox, FiAlertTriangle, FiCheckCircle,
  FiArrowUp, FiArrowDown
} from "react-icons/fi";

// ── Sub-components ───────────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, icon: Icon, iconColor, iconBg, trend, trendUp }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-default">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
        {Icon && <Icon size={18} style={{ color: iconColor }} />}
      </span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
        {trendUp ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
        {trend || "0%"}
      </span>
    </div>
    <p className="text-xs text-gray-400">{sub}</p>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-5">
    <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
  </div>
);

const ChartCard = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${className}`}>
    <SectionHeader title={title} subtitle={subtitle} />
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-xs z-50">
      {label && <p className="font-semibold text-gray-600 mb-2">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{prefix}{p.value?.toLocaleString()}{suffix}</span>
        </div>
      ))}
    </div>
  );
};

const renderPieLegend = (data) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
    {data?.map((item) => (
      <div key={item.name} className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
        <span className="text-xs text-gray-500">{item.name}</span>
        <span className="text-xs font-semibold text-gray-700">{item.value}</span>
      </div>
    ))}
  </div>
);

const statusStyles = {
  Critical: "bg-red-50 text-red-600 border border-red-100",
  Warning:  "bg-amber-50 text-amber-600 border border-amber-100",
  Good:     "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

const healthBarColor = (score) => {
  if (score < 50) return "#ef4444";
  if (score < 65) return "#f59e0b";
  return "#10b981";
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function Analytics({ assets = [] }) {
  const [dateRange, setDateRange] = useState("Last 6 Months");

  // ── Compute Analytics Dynamically from Assets Prop ──
  const analyticsData = useMemo(() => {
    const totalAssetsCount = assets.length;

    // Health score calculations
    const totalHealth = assets.reduce((acc, curr) => acc + (Number(curr.health) || 0), 0);
    const avgHealthScore = totalAssetsCount > 0 ? Math.round(totalHealth / totalAssetsCount) : 0;

    // Maintenance completions
    let totalCompleted = 0;
    let totalScheduled = 0;
    assets.forEach(a => {
      if (Array.isArray(a.maintenanceHistory)) {
        a.maintenanceHistory.forEach(m => {
          totalScheduled++;
          if (m.status?.toLowerCase() === "completed") totalCompleted++;
        });
      }
    });
    const completionRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

    // Open Issues count
    const openIssuesCount = assets.reduce((acc, a) => acc + (a.issues ? a.issues.length : 0), 0);

    // Asset Health Breakdown
    let optimal = 0, warning = 0, critical = 0;
    assets.forEach(a => {
      const h = Number(a.health) || 0;
      if (h >= 80) optimal++;
      else if (h >= 50) warning++;
      else critical++;
    });

    const assetHealthData = [
      { name: "Optimal (80-100%)", value: optimal, color: "#10b981" },
      { name: "Warning (50-79%)", value: warning, color: "#f59e0b" },
      { name: "Critical (<50%)", value: critical, color: "#ef4444" }
    ];

    // Category distribution
    const categoryCounts = {};
    assets.forEach(a => {
      const cat = a.category ? a.category.toUpperCase() : "UNCATEGORIZED";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const palette = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
    const assetCategoryData = Object.keys(categoryCounts).map((cat, idx) => ({
      name: cat,
      value: categoryCounts[cat],
      color: palette[idx % palette.length]
    }));

    // Critical Assets List
    const criticalList = assets
      .map(a => ({
        id: a.id,
        name: a.name,
        score: Number(a.health) || 0,
        status: (Number(a.health) || 0) < 50 ? "Critical" : (Number(a.health) || 0) < 80 ? "Warning" : "Good"
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    return {
      kpiData: {
        totalAssets: { value: totalAssetsCount, trend: "+0%", trendUp: true },
        healthScore: { value: `${avgHealthScore}%`, trend: "+0%", trendUp: avgHealthScore >= 70 },
        maintenanceCompletion: { value: `${completionRate}%`, trend: "+0%", trendUp: true },
        openIssues: { value: openIssuesCount, trend: "0%", trendUp: openIssuesCount === 0 }
      },
      assetHealthData,
      assetCategoryData,
      criticalList
    };
  }, [assets]);

  const { kpiData, assetHealthData, assetCategoryData, criticalList } = analyticsData;

  const handleExportCSV = () => {
    if (!assets.length) return;
    const csvRows = [
      ["Asset ID", "Name", "Category", "Health Score", "Status"],
      ...assets.map(a => [a.id, a.name, a.category, a.health, a.status])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Facility_Analytics_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans print:bg-white print:p-0">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics & Insights</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor facility performance, asset health, maintenance efficiency, and issue trends.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-indigo-300 transition-colors cursor-pointer">
              <FiCalendar size={14} className="text-gray-400 pointer-events-none" />
              <select
                className="bg-transparent outline-none text-sm text-gray-600 cursor-pointer"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {["Last 6 Months", "Last 3 Months", "This Year", "Custom Range"].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 rounded-lg px-4 py-2 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <FiDownload size={14} />
              Export Report
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
            >
              <FiFileText size={14} />
              Generate PDF
            </button>
          </div>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <KpiCard 
            label="Total Assets" 
            value={kpiData.totalAssets.value} 
            sub="Across all facility zones" 
            icon={FiBox} iconColor="#6366f1" iconBg="#eef2ff" 
            trend={kpiData.totalAssets.trend} trendUp={kpiData.totalAssets.trendUp} 
          />
          <KpiCard 
            label="Asset Health Score" 
            value={kpiData.healthScore.value} 
            sub="Overall portfolio condition" 
            icon={FiActivity} iconColor="#10b981" iconBg="#f0fdf4" 
            trend={kpiData.healthScore.trend} trendUp={kpiData.healthScore.trendUp} 
          />
          <KpiCard 
            label="Maintenance Completion" 
            value={kpiData.maintenanceCompletion.value} 
            sub="Tasks completed on schedule" 
            icon={FiCheckCircle} iconColor="#3b82f6" iconBg="#eff6ff" 
            trend={kpiData.maintenanceCompletion.trend} trendUp={kpiData.maintenanceCompletion.trendUp} 
          />
          <KpiCard 
            label="Open Issues" 
            value={kpiData.openIssues.value} 
            sub="Requiring attention" 
            icon={FiAlertTriangle} iconColor="#f59e0b" iconBg="#fffbeb" 
            trend={kpiData.openIssues.trend} trendUp={kpiData.openIssues.trendUp} 
          />
        </div>

        {/* Charts & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <ChartCard
            title="Asset Health Distribution"
            subtitle={`Condition breakdown across ${kpiData.totalAssets.value} assets`}
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={assetHealthData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {assetHealthData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {renderPieLegend(assetHealthData)}
          </ChartCard>

          <ChartCard
            title="Asset Category Distribution"
            subtitle="By system type"
            className="lg:col-span-3"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={assetCategoryData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value">
                  {assetCategoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {renderPieLegend(assetCategoryData)}
          </ChartCard>
        </div>

        {/* Critical Assets Table */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <ChartCard
            title="Top Critical Assets"
            subtitle="Assets requiring immediate or near-term attention"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Asset ID", "Asset Name", "Health Score", "Status"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {criticalList.length > 0 ? criticalList.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs text-gray-500 whitespace-nowrap">{a.id}</td>
                      <td className="py-3 pr-4 font-medium text-gray-800 whitespace-nowrap">{a.name}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-20">
                            <div className="h-1.5 rounded-full" style={{ width: `${a.score}%`, background: healthBarColor(a.score) }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 w-8 text-right">{a.score}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[a.status] || statusStyles.Good}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-xs text-gray-400">No critical assets reported.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

      </div>
    </div>
  );
}