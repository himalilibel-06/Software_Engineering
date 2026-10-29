import { useState, useEffect } from "react";
import {
  FiTool,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiPlus,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiList,
  FiX,
} from "react-icons/fi";

// ─── API Fetch Utility with Authorization Support ────────────────────────────

const BASE_URL = "http://localhost:5000";

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return response;
};

// ─── Component Configurations ─────────────────────────────────────────────────

const statusConfig = {
  Scheduled:   { dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700 border border-blue-200" },
  "In Progress": { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border border-amber-200" },
  Completed:   { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  Overdue:     { dot: "bg-rose-500", badge: "bg-rose-50 text-rose-700 border border-rose-200" },
};

const priorityConfig = {
  High:   "bg-rose-50 text-rose-700 border border-rose-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low:    "bg-blue-50 text-blue-700 border border-blue-200",
};

const categoryConfig = {
  Preventive: "bg-violet-50 text-violet-700 border border-violet-200",
  Corrective: "bg-orange-50 text-orange-700 border border-orange-200",
  Scheduled:  "bg-teal-50 text-teal-700 border border-teal-200",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, trend, trendUp, accent }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 cursor-default">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon size={17} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-slate-800 leading-none">{value}</span>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
          {trendUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
          {trend}
        </span>
      </div>
    </div>
  );
}

function Badge({ label, className }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Scheduled;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MaintenanceManagement() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null); 
  const [formData, setFormData] = useState({
    assetId: "",
    taskName: "",
    category: "Preventive",
    technician: "",
    priority: "Medium",
    dueDate: "",
    status: "Scheduled",
  });

  // Fetch Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/maintenance");
      if (response.ok) {
        const data = await response.json();
        setWorkOrders(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        console.warn("Unauthorized request. Please log in to get a valid token.");
      }
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Dynamic Metrics
  const totalCount = workOrders.length;
  const scheduledCount = workOrders.filter(w => w.status === "Scheduled").length;
  const inProgressCount = workOrders.filter(w => w.status === "In Progress").length;
  const completedCount = workOrders.filter(w => w.status === "Completed").length;
  const overdueCount = workOrders.filter(w => w.status === "Overdue").length;

  const filtered = workOrders.filter((wo) => {
    const q = search.toLowerCase();
    const idStr = String(wo.id || wo._id || "");
    const matchSearch =
      !q ||
      idStr.toLowerCase().includes(q) ||
      wo.taskName?.toLowerCase().includes(q) ||
      wo.assetId?.toLowerCase().includes(q) ||
      wo.technician?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || wo.status === filterStatus;
    const matchPriority = !filterPriority || wo.priority === filterPriority;
    const matchCategory = !filterCategory || wo.category === filterCategory;
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterPriority("");
    setFilterCategory("");
  };

  // Actions
  const handleOpenCreate = () => {
    setCurrentOrder(null);
    setFormData({
      assetId: "",
      taskName: "",
      category: "Preventive",
      technician: "",
      priority: "Medium",
      dueDate: new Date().toISOString().split('T')[0],
      status: "Scheduled"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order) => {
    setCurrentOrder(order);
    setFormData({ ...order });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Confirm destructive action: Permanently drop work order ${id}?`)) {
      try {
        const response = await apiFetch(`/api/maintenance/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setWorkOrders(prev => prev.filter(w => (w.id || w._id) !== id));
        } else {
          alert(`Failed to delete work order (${response.status})`);
        }
      } catch (err) {
        console.error("Network communication failure dropping entry:", err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentOrder) {
        const targetId = currentOrder.id || currentOrder._id;
        const response = await apiFetch(`/api/maintenance/${targetId}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchDashboardData();
          setIsModalOpen(false);
        } else {
          const errData = await response.json().catch(() => ({}));
          alert(`Failed to update work order (${response.status}): ${errData.message || response.statusText}`);
        }
      } else {
        const response = await apiFetch("/api/maintenance", {
          method: "POST",
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchDashboardData();
          setIsModalOpen(false);
        } else {
          const errData = await response.json().catch(() => ({}));
          alert(`Failed to create work order (${response.status}): ${errData.message || response.statusText}`);
        }
      }
    } catch (err) {
      console.error("Failed to commit operational schema modification updates:", err);
      alert("Network error encountered when sending work order to backend server.");
    }
  };

  const handleExport = () => {
    if (workOrders.length === 0) return alert("Operation canceled: Datastore is empty.");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workOrders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `maintenance_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-3">
        <FiRefreshCw className="animate-spin text-blue-600" size={32} />
        <p className="text-sm font-medium text-slate-500">Establishing real-time application states...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Maintenance Management</h1>
            <p className="text-sm text-slate-500 mt-1">Live operational dashboard for tracking facility management tasks.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button 
              onClick={handleExport} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
            >
              <FiDownload size={15} />
              Export Dataset
            </button>
            <button 
              onClick={handleOpenCreate} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
            >
              <FiPlus size={15} />
              Create Work Order
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={FiList}        label="Active Registry" value={totalCount} trend="Live"  trendUp={true}  accent="bg-blue-50 text-blue-600" />
          <KpiCard icon={FiCalendar}    label="Pending Queue"   value={scheduledCount + inProgressCount}  trend="Live"  trendUp={true}  accent="bg-violet-50 text-violet-600" />
          <KpiCard icon={FiCheckCircle} label="Settled Tasks"   value={completedCount}  trend="Live" trendUp={true}  accent="bg-emerald-50 text-emerald-600" />
          <KpiCard icon={FiAlertCircle} label="Overdue Metrics" value={overdueCount}  trend="Live"  trendUp={false} accent="bg-rose-50 text-rose-600" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Query operational indices by tags, ID, assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="">Status Categories</option>
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Overdue</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="">Priority Thresholds</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="">Operations Nature</option>
              <option>Preventive</option>
              <option>Corrective</option>
              <option>Scheduled</option>
            </select>

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
            >
              <FiRefreshCw size={13} />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiTool size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">Operational Log Matrix</h2>
              <span className="ml-1 bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Work Order ID", "Asset Tracking Ref", "Functional Objective", "Category", "Technician Assigned", "Priority", "Due Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                      Datastore register empty. Create a work order to populate telemetry.
                    </td>
                  </tr>
                ) : (
                  filtered.map((wo) => {
                    const orderId = wo.id || wo._id;
                    return (
                      <tr key={orderId} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600 whitespace-nowrap">{orderId}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{wo.assetId}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{wo.taskName}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge label={wo.category} className={categoryConfig[wo.category] || ""} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 font-medium">{wo.technician || "Unassigned"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge label={wo.priority} className={priorityConfig[wo.priority] || ""} />
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{wo.dueDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={wo.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEdit(wo)} className="p-1.5 rounded-md hover:bg-amber-50 hover:text-amber-600 text-slate-500 transition-colors cursor-pointer">
                              <FiEdit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(orderId)} className="p-1.5 rounded-md hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer">
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden transition-all">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {currentOrder ? `Modify Schema Entry ${currentOrder.id || currentOrder._id}` : "Compile Operational Manifest"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Asset Reference String</label>
                <input
                  type="text"
                  required
                  placeholder="System ID Tag"
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Functional Directive Objective</label>
                <input
                  type="text"
                  required
                  placeholder="Task scope details"
                  value={formData.taskName}
                  onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Classification Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>Preventive</option>
                    <option>Corrective</option>
                    <option>Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Priority Metric</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Technician Assignee Name</label>
                <input
                  type="text"
                  placeholder="Assign engineer..."
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Target Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">State Resolution</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>Scheduled</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
                >
                  Commit To Node Vector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}