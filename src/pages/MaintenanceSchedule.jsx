import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import {
  FiCalendar, FiCheckSquare, FiClock, FiAlertOctagon,
  FiSearch, FiDownload, FiPlus, FiRefreshCw,
  FiEye, FiCheck, FiTrash2, FiTag, FiLayers, FiX
} from "react-icons/fi";

// ─── Constants & Styling Configurations ───────────────────────────────────────

const FREQUENCY_OPTIONS = ["All", "Monthly", "Quarterly", "Semi-Annually", "Annually"];
const STATUS_OPTIONS = ["All", "Scheduled", "Completed", "Overdue"];

const statusStyles = {
  "Scheduled": { bg: "bg-blue-100",  text: "text-blue-700",  dot: "bg-blue-500"  },
  "Completed": { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  "Overdue":   { bg: "bg-red-100",   text: "text-red-700",   dot: "bg-red-500"   },
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

export default function MaintenanceSchedule() {
  // Database States
  const [scheduleList, setScheduleList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter Interface States
  const [search, setSearch] = useState("");
  const [frequency, setFrequency] = useState("All");
  const [status, setStatus] = useState("All");

  // Modal Control State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial Form State
  const initialFormState = {
    assetId: "",
    taskName: "",
    frequency: "Monthly",
    scheduledDate: "",
    assignedTeam: "Unassigned",
    workStatus: "Scheduled"
  };

  const [formData, setFormData] = useState(initialFormState);

  // 🔄 GET: Fetch Schedule Logs from MongoDB
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/maintenance");
      if (res.ok) {
        const data = await res.json();
        // Auto-calculate if an item has gone overdue before committing to state
        const processedData = (Array.isArray(data) ? data : []).map(task => {
          if (task.workStatus !== "Completed" && new Date(task.scheduledDate) < new Date()) {
            return { ...task, workStatus: "Overdue" };
          }
          return task;
        });

        setScheduleList(processedData);
      } else {
        console.warn("Maintenance schedules request failed with status:", res.status);
      }
    } catch (err) {
      console.error("Error communicating with maintenance API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // 📥 POST: Save dynamic calendar routine task
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch("/api/maintenance", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchSchedules(); // Refresh schedule list directly
        setFormData(initialFormState);
        setIsModalOpen(false);
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || err.error || "Failed to commit routine run.");
      }
    } catch (err) {
      console.error("Failed to commit to database:", err);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const res = await apiFetch(`/api/maintenance/${id}`, {
        method: "PUT",
        body: JSON.stringify({ workStatus: "Completed", status: "Completed" })
      });
      if (res.ok) {
        await fetchSchedules();
      } else {
        alert("Failed to update status to Completed.");
      }
    } catch (err) {
      console.error("Error marking task complete:", err);
    }
  };

  const handleCancelTask = async (id) => {
    if (!window.confirm("Cancel and delete this maintenance schedule?")) return;
    try {
      const res = await apiFetch(`/api/maintenance/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchSchedules();
      } else {
        alert("Failed to delete maintenance task.");
      }
    } catch (err) {
      console.error("Error deleting maintenance schedule:", err);
    }
  };

  // 🧮 Compute Dynamic KPI Metrics Counter Cards
  const totalTasks = scheduleList.length;
  const pendingTasks = scheduleList.filter(t => t.workStatus === "Scheduled").length;
  const completedTasks = scheduleList.filter(t => t.workStatus === "Completed").length;
  const overdueTasks = scheduleList.filter(t => t.workStatus === "Overdue").length;

  // 🔍 Interactive Real-Time Layout Search Filter Pipeline
  const filtered = scheduleList.filter(task => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (task.assetId && task.assetId.toLowerCase().includes(q)) ||
      (task.taskName && task.taskName.toLowerCase().includes(q)) ||
      (task.assignedTeam && task.assignedTeam.toLowerCase().includes(q));
    return (
      matchSearch &&
      (frequency === "All" || task.frequency === frequency) &&
      (status === "All" || task.workStatus === status)
    );
  });

  const resetFilters = () => { setSearch(""); setFrequency("All"); setStatus("All"); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center space-y-3">
          <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500">Querying preventative scheduler boards...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Maintenance Scheduler</h1>
            <p className="mt-1 text-sm text-gray-500">Plan routine service cycles and track preventative facility compliance windows.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all focus:outline-none shadow-sm">
              <FiDownload className="w-4 h-4" />
              Export Timeline
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <FiPlus className="w-4 h-4" />
              Schedule Routine
            </button>
          </div>
        </div>

        {/* ── Dynamic Counters ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <KpiCard icon={FiCalendar}    label="Total Routines"     value={totalTasks}     color="text-blue-600"   lightColor="bg-blue-50"   change="Aggregated checks" />
          <KpiCard icon={FiClock}       label="Pending Window"     value={pendingTasks}   color="text-amber-600"  lightColor="bg-amber-50"  change="Upcoming system runs" />
          <KpiCard icon={FiCheckSquare} label="Completed Runs"     value={completedTasks} color="text-green-600"  lightColor="bg-green-50"  change="Compliant facility records" />
          <KpiCard icon={FiAlertOctagon} label="Overdue Breaches"   value={overdueTasks}   color="text-red-600"    lightColor="bg-red-50"    change="Requires immediate dispatch" />
        </div>

        {/* ── Real-Time Filter Controls Group ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by asset code link, task title description, or crew..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { label: "Interval", value: frequency, setter: setFrequency, opts: FREQUENCY_OPTIONS },
                { label: "Status",   value: status,    setter: setStatus,    opts: STATUS_OPTIONS },
              ].map(({ label, value, setter, opts }) => (
                <div key={label} className="relative">
                  <FiLayers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
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
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── Maintenance Calendar Table View ─────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Active PM Windows</h2>
            <p className="text-sm text-gray-500 mt-0.5">Showing {filtered.length} of {totalTasks} scheduled events</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Asset ID", "Task Description", "Service Frequency", "Target Date", "Responsible Crew", "Status", "Actions"].map(h => (
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
                      No preventative system routines are scheduled matching the current parameters.
                    </td>
                  </tr>
                ) : filtered.map(task => (
                  <tr key={task._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-blue-600 whitespace-nowrap">{task.assetId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">{task.taskName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FiTag className="w-3.5 h-3.5 text-gray-400" />
                        {task.frequency}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap font-medium">
                      {task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString(undefined, { dateStyle: "medium" }) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{task.assignedTeam}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge label={task.workStatus} styleMap={statusStyles} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => alert(`Task: ${task.taskName}\nAsset: ${task.assetId}\nScheduled: ${new Date(task.scheduledDate).toLocaleDateString()}\nTeam: ${task.assignedTeam}\nStatus: ${task.workStatus}`)} title="Inspect Details" className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"><FiEye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleCompleteTask(task._id || task.assetId)} title="Mark Completed" className="p-1.5 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"><FiCheck className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleCancelTask(task._id || task.assetId)} title="Cancel Schedule" className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Overlay Modal: Plan & Schedule New Routine Window ─────────── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-lg w-full overflow-hidden transform scale-100 transition-all">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Schedule Preventative Run</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all cursor-pointer">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Asset ID</label>
                    <input required type="text" placeholder="e.g. PUMP-101" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value.toUpperCase().trim()})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Interval Frequency</label>
                    <select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      {FREQUENCY_OPTIONS.filter(f => f !== "All").map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Routine Operation Task Name</label>
                  <input required type="text" placeholder="e.g. Standard Core Vibration Calibration" value={formData.taskName} onChange={e => setFormData({...formData, taskName: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Plan Date</label>
                    <input required type="date" value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Responsible Team Crew</label>
                    <input type="text" placeholder="e.g. Electrical Crew" value={formData.assignedTeam} onChange={e => setFormData({...formData, assignedTeam: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm cursor-pointer">Commit Run</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}