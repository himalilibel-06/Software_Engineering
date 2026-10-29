import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import {
  FiBox, FiActivity, FiTool, FiAlertTriangle, 
  FiSearch, FiFilter, FiDownload, FiPlus, FiRefreshCw,
  FiEye, FiEdit2, FiTrash2, FiMapPin, FiCalendar, FiX
} from "react-icons/fi";

// ─── Constants & Styling Configurations ───────────────────────────────────────

const STATUS_OPTIONS = ["All", "Operational", "Under Maintenance", "Faulty"];
const CATEGORY_OPTIONS = ["All", "Plumbing", "HVAC", "Electrical", "Mechanical", "Safety"];

const statusStyles = {
  "Operational":       { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  },
  "Under Maintenance": { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  "Faulty":            { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
};

const Badge = ({ label, styleMap }) => {
  const s = styleMap[label] || {};
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg || "bg-gray-100"} ${s.text || "text-gray-700"}`}>
      {s.dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      {label}
    </span>
  );
};

const KpiCard = ({ icon: Icon, label, value, color, lightColor, change }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${lightColor} flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-0.5 leading-none">{value}</p>
      {change && <p className="text-xs text-gray-400 mt-1">{change}</p>}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AssetInventory() {
  // Database States
  const [assetsList, setAssetsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter Interface States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Asset Form State
  const [formData, setFormData] = useState({
    assetId: "",
    name: "",
    category: "Plumbing",
    location: "",
    status: "Operational"
  });

  // 🔄 GET: Fetch Asset Documents from MongoDB
  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/assets");
      if (res.ok) {
        const data = await res.json();
        setAssetsList(Array.isArray(data) ? data : []);
      } else {
        console.warn("Assets request failed with status:", res.status);
      }
    } catch (err) {
      console.error("Error communicating with asset database pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // 📥 POST: Submit Form Data to register item
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/api/assets", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ assetId: "", name: "", category: "Plumbing", location: "", status: "Operational" });
        await fetchAssets(); // Refresh active rows list
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || errorData.message || "Failed to save asset registration.");
      }
    } catch (err) {
      console.error("Network fault while registering infrastructure asset:", err);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm(`Are you sure you want to delete asset ${assetId}?`)) return;
    try {
      const res = await apiFetch(`/api/assets/${assetId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchAssets();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || errorData.message || "Failed to delete asset.");
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
    }
  };

  // 🧮 Compute Dynamic Asset Counter Numbers
  const totalAssetsCount = assetsList.length;
  const operationalCount = assetsList.filter(a => a.status === "Operational").length;
  const maintenanceCount = assetsList.filter(a => a.status === "Under Maintenance").length;
  const faultyCount = assetsList.filter(a => a.status === "Faulty").length;

  // Calculate operational uptime rate percentage
  const activeRate = totalAssetsCount > 0 ? Math.round((operationalCount / totalAssetsCount) * 100) : 100;

  // 🔍 Interactive Real-Time Search Filtering
  const filtered = assetsList.filter(asset => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (asset.assetId && asset.assetId.toLowerCase().includes(q)) ||
      (asset.name && asset.name.toLowerCase().includes(q)) ||
      (asset.location && asset.location.toLowerCase().includes(q));
    return (
      matchSearch &&
      (status === "All" || asset.status === status) &&
      (category === "All" || asset.category === category)
    );
  });

  const resetFilters = () => { setSearch(""); setStatus("All"); setCategory("All"); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center space-y-3">
          <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500">Retrieving master asset index registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Page Header Layout ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Asset Inventory</h1>
            <p className="mt-1 text-sm text-gray-500">Manage, locate, and monitor physical facility hardware infrastructure assets.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all focus:outline-none shadow-sm">
              <FiDownload className="w-4 h-4" />
              Export Directory
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <FiPlus className="w-4 h-4" />
              Register Asset
            </button>
          </div>
        </div>

        {/* ── Dynamic Counters ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <KpiCard icon={FiBox}           label="Total Assets"        value={totalAssetsCount} color="text-blue-600"   lightColor="bg-blue-50"   change="Physical items tracked" />
          <KpiCard icon={FiActivity}      label="Operational Rate"    value={`${activeRate}%`} color="text-green-600"  lightColor="bg-green-50"  change="Optimal system running status" />
          <KpiCard icon={FiTool}          label="Under Maintenance"   value={maintenanceCount} color="text-amber-600"  lightColor="bg-amber-50"  change="Active field work tickets" />
          <KpiCard icon={FiAlertTriangle} label="Faulty / Offline"    value={faultyCount}      color="text-red-600"    lightColor="bg-red-50"    change="Requires prompt diagnosis" />
        </div>

        {/* ── Real-Time Filter Controls Group ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by asset token ID, name, or room floor location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { label: "Status",   value: status,   setter: setStatus,   opts: STATUS_OPTIONS },
                { label: "Category", value: category, setter: setCategory, opts: CATEGORY_OPTIONS },
              ].map(({ label, value, setter, opts }) => (
                <div key={label} className="relative">
                  <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <select
                    value={value}
                    onChange={e => setter(e.target.value)}
                    className="pl-8 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    {opts.map(o => <option key={o} value={o}>{o === "All" ? `${label}: All` : o}</option>)}
                  </select>
                </div>
              ))}

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── Asset Inventory Table View ────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Master Asset Records</h2>
            <p className="text-sm text-gray-500 mt-0.5">Showing {filtered.length} of {totalAssetsCount} verified system entries</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Asset ID", "Asset Name", "Category Domain", "Location / Area", "Created Date", "Operational Status", "Actions"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
                      No infrastructural physical hardware devices match the criteria lookup details.
                    </td>
                  </tr>
                ) : filtered.map(asset => (
                  <tr key={asset._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-blue-600 whitespace-nowrap">{asset.assetId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">{asset.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{asset.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <FiMapPin className="w-3.5 h-3.5 text-gray-400" />
                        {asset.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                        {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge label={asset.status || "Operational"} styleMap={statusStyles} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => alert(`Asset ${asset.assetId}: ${asset.name}\nLocation: ${asset.location}\nStatus: ${asset.status}`)} title="View Details" className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"><FiEye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteAsset(asset._id || asset.assetId)} title="Decommission Asset" className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Overlay Modal: Register Brand New Hardware Asset ───────────── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-lg w-full overflow-hidden transform scale-100 transition-all">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Register Facility Hardware Asset</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Unique Asset ID</label>
                    <input required type="text" placeholder="e.g. PUMP-101" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value.toUpperCase().trim()})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category Domain</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      {CATEGORY_OPTIONS.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Asset Name Descriptor</label>
                  <input required type="text" placeholder="e.g. Primary Chilled Water Loop Pump" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Installation Physical Location</label>
                  <input required type="text" placeholder="e.g. Plant Room Basement Level B2" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Initial Status Configuration</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option value="Operational">Operational (Healthy Running State)</option>
                    <option value="Under Maintenance">Under Maintenance (Awaiting Inspection)</option>
                    <option value="Faulty">Faulty / Offline (Defect Flagged)</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">Save Register</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}