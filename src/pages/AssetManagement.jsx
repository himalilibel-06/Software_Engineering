import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AssetAnalytics from '../components/AssetAnalytics';
import { apiFetch } from '../lib/api';
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye,
  FiChevronLeft, FiChevronRight, FiActivity,
  FiAlertTriangle, FiSettings, FiCheckCircle,
  FiFilter, FiDownload, FiRefreshCw, FiX
} from "react-icons/fi";
import { MdOutlineEngineering } from "react-icons/md";

const STATUS_CONFIG = {
  Operational: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  Maintenance: { color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  Critical: { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
};

const HEALTH_COLOR = (h) => {
  if (h >= 80) return { bar: "bg-emerald-500", text: "text-emerald-600" };
  if (h >= 60) return { bar: "bg-amber-500", text: "text-amber-600" };
  return { bar: "bg-red-500", text: "text-red-600" };
};

const STATUSES = ["All Status", "Operational", "Maintenance", "Critical"];
const PAGE_SIZE = 6;

export default function AssetManagement() {
  const navigate = useNavigate();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [assets, setAssets] = useState([]); 
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [newAsset, setNewAsset] = useState({
    assetId: "",
    name: "",
    category: "",
    location: "",
    status: "Operational",
    health: 100,
    model: ""
  });

  // ==========================================
  // ASYNC FETCH: DATA FETCHING FROM BACKEND
  // ==========================================
  const loadAssetsFromBackend = async () => {
    setIsSyncing(true);
    try {
      const response = await apiFetch('/api/assets');
      const data = await response.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading assets from database:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadAssetsFromBackend();
  }, []);

  // Dynamically generate unique categories based on state data
  const CATEGORIES = [
    "All Categories",
    ...Array.from(new Set(assets.map((a) => a.category).filter(Boolean)))
  ];

  // Filters logic 
  const filtered = assets.filter((a) => {
    const matchSearch =
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.assetId || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.location || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All Status" || a.status === filterStatus;
    const matchCat = filterCategory === "All Categories" || a.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: assets.length,
    operational: assets.filter((a) => a.status === "Operational").length,
    maintenance: assets.filter((a) => a.status === "Maintenance").length,
    critical: assets.filter((a) => a.status === "Critical").length,
  };

  // ==========================================
  // BUTTON ACTION HANDLERS
  // ==========================================
  const handleExportCSV = () => {
    if (assets.length === 0) {
      alert("No asset data available to export.");
      return;
    }

    const headers = ["Asset ID", "Asset Name", "Category", "Location", "Status", "Health Score", "Last Maintenance"];
    const csvRows = [
      headers.join(","),
      ...assets.map(asset => [
        `"${asset.assetId || ''}"`,
        `"${asset.name || ''}"`,
        `"${asset.category || ''}"`,
        `"${asset.location || ''}"`,
        `"${asset.status || 'Operational'}"`,
        `"${asset.health || 100}%"`,
        `"${asset.lastMaintenance || ''}"`
      ].join(","))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BIM_Asset_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (assetId) => {
    try {
      const response = await apiFetch(`/api/assets/${assetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAssetsFromBackend();
        setAssetToDelete(null); 
      } else {
        const errData = await response.json();
        alert(`Failed to delete: ${errData.message}`);
      }
    } catch (error) {
      console.error("Error deleting asset on backend:", error);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset({
      ...asset,
      status: asset.status || "Operational",
      health: asset.health ?? 100
    });
    setShowEditModal(true);
  };

  const handleView = (asset) => {
    setSelected(asset); 
    setShowModal(true);
  };

  const handleAddAsset = async () => {
    if (!newAsset.assetId || !newAsset.name || !newAsset.category || !newAsset.location) {
      alert("Please fill all required fields");
      return;
    }

    const assetPayload = {
      ...newAsset,
      health: Number(newAsset.health) || 100,
      lastMaintenance: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await apiFetch('/api/assets', {
        method: 'POST',
        body: JSON.stringify(assetPayload)
      });

      if (response.ok) {
        await loadAssetsFromBackend();
        setNewAsset({ assetId: "", name: "", category: "", location: "", status: "Operational", health: 100, model: "" });
        setShowAddModal(false);
      } else {
        const errData = await response.json();
        alert(`Failed to save: ${errData.message || 'Invalid or Expired Token'}`);
      }
    } catch (error) {
      console.error("Error posting asset to backend:", error);
    }
  };

  const handleUpdateAsset = async () => {
    if (!editingAsset.assetId) return;

    try {
      const response = await apiFetch(`/api/assets/${editingAsset.assetId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...editingAsset,
          health: Number(editingAsset.health) || 100
        })
      });

      if (response.ok) {
        await loadAssetsFromBackend();
        setShowEditModal(false);
        setEditingAsset(null);
      } else {
        const result = await response.json();
        alert(`❌ Error updating asset: ${result.message}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("All Status");
    setFilterCategory("All Categories");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <MdOutlineEngineering className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800 leading-tight">Asset Management</h1>
              <p className="text-xs text-slate-500 leading-tight">Manage facility assets and equipment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCSV} 
              className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <FiDownload size={13} /> Export
            </button>
            <button 
              onClick={loadAssetsFromBackend} 
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FiRefreshCw size={13} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Syncing..." : "Sync"}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-2 transition-colors font-medium shadow-sm cursor-pointer"
            >
              <FiPlus size={13} /> Add Asset
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Assets", value: stats.total, icon: <FiActivity />, iconBg: "bg-blue-50 text-blue-600", border: "border-l-blue-500" },
            { label: "Operational", value: stats.operational, icon: <FiCheckCircle />, iconBg: "bg-emerald-50 text-emerald-600", border: "border-l-emerald-500" },
            { label: "Under Maintenance", value: stats.maintenance, icon: <FiSettings />, iconBg: "bg-amber-50 text-amber-600", border: "border-l-amber-500" },
            { label: "Critical Assets", value: stats.critical, icon: <FiAlertTriangle />, iconBg: "bg-red-50 text-red-600", border: "border-l-red-500" },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${s.border} p-4 shadow-sm`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {stats.total > 0 ? ((s.value / stats.total) * 100).toFixed(0) : 0}% of total fleet
                  </p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center text-base`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <AssetAnalytics assets={assets} />

        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              <input
                type="text"
                placeholder="Search by name, ID, or location…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 text-slate-700"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="pl-8 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white appearance-none cursor-pointer"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                className="pl-8 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            {(search || filterStatus !== "All Status" || filterCategory !== "All Categories") && (
              <button onClick={resetFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                Clear filters
              </button>
            )}
            <span className="ml-auto text-xs text-slate-400">{filtered.length} asset{filtered.length !== 1 ? "s" : ""} found</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["Asset ID", "Asset Name", "Category", "Location", "Status", "Health Score", "Last Maintenance", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400">
                      <FiActivity className="mx-auto mb-3 text-3xl text-slate-300" />
                      <p className="font-medium">No assets found</p>
                      <p className="text-xs mt-1">Click 'Add Asset' to populate your cloud database</p>
                    </td>
                  </tr>
                ) : paginated.map((asset) => {
                  const sc = STATUS_CONFIG[asset.status || 'Operational'] || STATUS_CONFIG.Operational;
                  const hc = HEALTH_COLOR(asset.health ?? 100);
                  return (
                    <tr key={asset.assetId} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          {asset.assetId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">{asset.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-500 text-xs">{asset.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-600 text-xs">{asset.location}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {asset.status || 'Operational'}
                        </span>
                      </td>
                      <td className="px-4 py-3 min-w-32">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${hc.bar}`}
                              style={{ width: `${asset.health ?? 100}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold tabular-nums ${hc.text} w-8 text-right`}>
                            {asset.health ?? 100}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-500">{asset.lastMaintenance}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleView(asset)}
                            title="View Details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <FiEye size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(asset)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => setAssetToDelete(asset._id)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {filtered.length > 0 ? Math.min((page - 1) * PAGE_SIZE + 1, filtered.length) : 0}–{Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-medium text-slate-700">{filtered.length}</span> assets
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <FiChevronLeft size={13} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded-lg border transition-colors cursor-pointer ${
                    p === page
                      ? "bg-blue-600 text-white border-blue-600 font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next <FiChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-800 text-base">Asset Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Full record for {selected.assetId}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <MdOutlineEngineering className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{selected.name}</p>
                  <p className="font-mono text-xs text-blue-600">{selected.assetId}</p>
                </div>
                <div className="ml-auto">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${(STATUS_CONFIG[selected.status || 'Operational'] || STATUS_CONFIG.Operational).color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(STATUS_CONFIG[selected.status || 'Operational'] || STATUS_CONFIG.Operational).dot}`} />
                    {selected.status || 'Operational'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Category", value: selected.category },
                  { label: "Location", value: selected.location },
                  { label: "Model", value: selected.model || "N/A" },
                  { label: "Assigned Technician", value: selected.technician || "Not Assigned" },
                  { label: "Last Maintenance", value: selected.lastMaintenance },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                    <p className="text-sm text-slate-700 font-medium mt-0.5">{value}</p>
                  </div>
                ))}
                <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-slate-400 font-medium">Health Score</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${HEALTH_COLOR(selected.health ?? 100).bar}`}
                        style={{ width: `${selected.health ?? 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${HEALTH_COLOR(selected.health ?? 100).text}`}>
                      {selected.health ?? 100}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => { setShowModal(false); navigate("/asset-details", { state: { asset: selected } }); }} 
                className="px-4 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium cursor-pointer"
              >
                Full Details Page
              </button>
              <button 
                onClick={() => { setShowModal(false); handleEdit(selected); }} 
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium cursor-pointer"
              >
                Edit Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Add New Asset</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Asset ID</label>
                <input
                  type="text"
                  placeholder="e.g., AST-101"
                  value={newAsset.assetId}
                  onChange={(e) => setNewAsset({ ...newAsset, assetId: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g., Air Handling Unit 1"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g., HVAC, Electrical"
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Room 102, Roof"
                  value={newAsset.location}
                  onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Initial Status</label>
                  <select
                    value={newAsset.status}
                    onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Health Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAsset.health}
                    onChange={(e) => setNewAsset({ ...newAsset, health: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddAsset} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer">
                Add Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {showEditModal && editingAsset && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Edit Asset</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Asset Name</label>
                <input
                  type="text"
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                <input
                  type="text"
                  value={editingAsset.category}
                  onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={editingAsset.location}
                  onChange={(e) => setEditingAsset({ ...editingAsset, location: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
                  <select
                    value={editingAsset.status || "Operational"}
                    onChange={(e) => setEditingAsset({ ...editingAsset, status: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Health Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingAsset.health ?? 100}
                    onChange={(e) => setEditingAsset({ ...editingAsset, health: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleUpdateAsset} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Delete Confirmation Modal */}
      {assetToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <FiAlertTriangle />
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center">Delete Asset</h3>
            <p className="text-sm text-slate-500 text-center mt-2 px-2">
              Are you sure you want to permanently delete this asset? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setAssetToDelete(null)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(assetToDelete)}
                className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}