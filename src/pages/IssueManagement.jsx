import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import {
  FiAlertCircle, FiClock, FiCheckCircle, FiList,
  FiSearch, FiFilter, FiDownload, FiPlus, FiRefreshCw,
  FiEye, FiUserPlus, FiTrash2, FiUser,
  FiCalendar, FiX, FiAlertTriangle
} from "react-icons/fi";

// ─── Constants & Styling Configurations ───────────────────────────────────────

const STATUS_OPTIONS = ["All", "Open", "In Progress", "Resolved"];
const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];
const CATEGORY_OPTIONS = ["All", "Plumbing", "HVAC", "Electrical", "Mechanical", "Safety"];

const statusStyles = {
  "Open":        { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
  "In Progress": { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  "Resolved":    { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  },
};

const priorityStyles = {
  "High":   { bg: "bg-red-100",   text: "text-red-700"   },
  "Medium": { bg: "bg-amber-100", text: "text-amber-700" },
  "Low":    { bg: "bg-blue-100",  text: "text-blue-700"  },
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

// Default list of technicians used if database roster is empty
const DEFAULT_TECHNICIANS = [
  { _id: "t1", name: "Sharma", role: "HVAC Specialist" },
  { _id: "t2", name: "Romel", role: "Plumbing Lead" },
  { _id: "t3", name: "Alex Smith", role: "Electrical Tech" },
  { _id: "t4", name: "John Doe", role: "Facility Maintenance" },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export default function IssueManagement() {
  // Database State Storage
  const [issuesList, setIssuesList] = useState([]);
  const [techniciansList, setTechniciansList] = useState(DEFAULT_TECHNICIANS);
  const [loading, setLoading] = useState(true);
  
  // Interface Control Filtering States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [category, setCategory] = useState("All");
  
  // Modal Overlays Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assigningIssueId, setAssigningIssueId] = useState(null);
  const [customTechName, setCustomTechName] = useState("");
  const [issueToDelete, setIssueToDelete] = useState(null);

  // New Issue Creation Form State
  const [formData, setFormData] = useState({
    title: "",
    assetId: "",
    category: "Plumbing",
    priority: "Medium",
    reportedBy: "",
    assignedTo: ""
  });

  // 🔄 GET: Fetch entries from MongoDB Cluster
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/issues");
      const data = await res.json();
      setIssuesList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error connecting to server pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // 📥 Export Issues to CSV File
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("No issues available to export.");
      return;
    }

    const headers = ["Issue ID", "Issue Title", "Asset ID", "Category", "Priority", "Reported By", "Assigned To", "Date Reported", "Status"];
    const csvRows = [
      headers.join(","),
      ...filtered.map(issue => [
        `"${issue._id ? issue._id.substring(0, 7).toUpperCase() : 'N/A'}"`,
        `"${issue.title || ''}"`,
        `"${issue.assetId || ''}"`,
        `"${issue.category || ''}"`,
        `"${issue.priority || ''}"`,
        `"${issue.reportedBy || ''}"`,
        `"${issue.assignedTo || 'Unassigned'}"`,
        `"${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}"`,
        `"${issue.status || 'Open'}"`
      ].join(","))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Issue_Management_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📥 POST: Handle Form Submission to create a new log document
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/api/issues", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false); 
        setFormData({ title: "", assetId: "", category: "Plumbing", priority: "Medium", reportedBy: "", assignedTo: "" }); 
        fetchIssues(); 
      }
    } catch (err) {
      console.error("Failed to post issue log:", err);
    }
  };

  // 🔄 PUT: Directly Update Status Workflow via Dropdown Selector
  const handleDirectStatusChange = async (id, nextStatus) => {
    try {
      const res = await apiFetch(`/api/issues/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setIssuesList(issuesList.map(issue => issue._id === id ? updatedItem : issue));
      } else {
        setIssuesList(issuesList.map(issue => issue._id === id ? { ...issue, status: nextStatus } : issue));
      }
    } catch (err) {
      console.error("Failed to transition status state:", err);
      setIssuesList(issuesList.map(issue => issue._id === id ? { ...issue, status: nextStatus } : issue));
    }
  };

  // 👥 GET + Trigger: Fetch Roster and open assignment dialogue
  const openAssignmentModal = async (id) => {
    setAssigningIssueId(id);
    setCustomTechName("");
    try {
      const res = await apiFetch("/api/technicians");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTechniciansList(data);
      } else {
        setTechniciansList(DEFAULT_TECHNICIANS);
      }
    } catch (err) {
      console.error("Error loading field staff rosters dynamically:", err);
      setTechniciansList(DEFAULT_TECHNICIANS);
    }
  };

  // 👤 PUT: Save staff assignment modification back to database
  const handleAssignStaff = async (id, staffName) => {
    if (!staffName) return;
    try {
      const res = await apiFetch(`/api/issues/${id}/assign`, {
        method: "PUT",
        body: JSON.stringify({ assignedTo: staffName.trim() }),
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setIssuesList(issuesList.map(issue => issue._id === id ? updatedItem : issue));
      } else {
        setIssuesList(issuesList.map(issue => issue._id === id ? { ...issue, assignedTo: staffName.trim() } : issue));
      }
    } catch (err) {
      console.error("Failed to update staff assignment:", err);
      setIssuesList(issuesList.map(issue => issue._id === id ? { ...issue, assignedTo: staffName.trim() } : issue));
    } finally {
      setAssigningIssueId(null);
      setCustomTechName("");
    }
  };

  // 🗑️ DELETE: Delete issue log document
  const confirmDeleteIssue = async (id) => {
    try {
      const res = await apiFetch(`/api/issues/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIssuesList(issuesList.filter((issue) => issue._id !== id));
      } else {
        setIssuesList(issuesList.filter((issue) => issue._id !== id));
      }
    } catch (err) {
      console.error("Network error during deletion routine:", err);
      setIssuesList(issuesList.filter((issue) => issue._id !== id));
    } finally {
      setIssueToDelete(null);
    }
  };

  // Read-only details inspector handler
  const handleViewIssue = (issue) => {
    setSelectedIssue(issue);
    setIsViewModalOpen(true);
  };

  // Compute Dynamic KPI Counter Metrics from running data array
  const totalIssuesCount = issuesList.length;
  const openCount = issuesList.filter(i => i.status === "Open" || !i.status).length;
  const inProgressCount = issuesList.filter(i => i.status === "In Progress").length;
  const resolvedCount = issuesList.filter(i => i.status === "Resolved").length;

  // Real-Time Search and Filter Operations
  const filtered = issuesList.filter(issue => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (issue._id && issue._id.toLowerCase().includes(q)) ||
      (issue.title && issue.title.toLowerCase().includes(q)) ||
      (issue.assetId && issue.assetId.toLowerCase().includes(q));
    return (
      matchSearch &&
      (status   === "All" || (issue.status || "Open") === status) &&
      (priority === "All" || issue.priority === priority) &&
      (category === "All" || issue.category === category)
    );
  });

  const resetFilters = () => { setSearch(""); setStatus("All"); setPriority("All"); setCategory("All"); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center space-y-3">
          <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500">Querying live database cluster...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Issue Management</h1>
            <p className="mt-1 text-sm text-gray-500">Track, assign, and resolve facility issues across building assets.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
            >
              <FiDownload className="w-4 h-4" />
              Export Issues
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              Report Issue
            </button>
          </div>
        </div>

        {/* ── Dynamic Counters ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <KpiCard icon={FiList}        label="Total Issues"     value={totalIssuesCount} color="text-blue-600"   lightColor="bg-blue-50"   change="All time records" />
          <KpiCard icon={FiAlertCircle} label="Open Issues"      value={openCount}        color="text-red-600"    lightColor="bg-red-50"    change="Needs attention" />
          <KpiCard icon={FiClock}       label="In Progress"      value={inProgressCount}  color="text-amber-600"  lightColor="bg-amber-50"  change="Actively worked" />
          <KpiCard icon={FiCheckCircle} label="Resolved Issues"  value={resolvedCount}    color="text-green-600"  lightColor="bg-green-50"  change="Successfully closed" />
        </div>

        {/* ── Real-Time Filter Controls Group ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by issue ID, title, or asset..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { label: "Status",   value: status,   setter: setStatus,   opts: STATUS_OPTIONS },
                { label: "Priority", value: priority, setter: setPriority, opts: PRIORITY_OPTIONS },
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
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── Operational Log Records Matrix (Table View) ────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Issue Records</h2>
              <p className="text-sm text-gray-500 mt-0.5">Showing {filtered.length} of {totalIssuesCount} entries</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Issue ID","Issue Title","Asset ID","Category","Priority","Reported By","Assigned To","Date Reported","Status","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-400">
                      No matching facility issue logs found.
                    </td>
                  </tr>
                ) : filtered.map(issue => {
                  const currentStat = issue.status || "Open";
                  const sStyle = statusStyles[currentStat] || statusStyles["Open"];

                  return (
                    <tr key={issue._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-3.5 text-sm font-mono font-semibold text-blue-600 whitespace-nowrap truncate max-w-[100px]" title={issue._id}>
                        {issue._id ? issue._id.substring(0, 7).toUpperCase() : "NEW"}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-900 font-medium max-w-[180px] truncate">{issue.title}</td>
                      <td className="px-4 py-3.5 text-sm font-mono text-gray-600 whitespace-nowrap">{issue.assetId}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{issue.category}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><Badge label={issue.priority} styleMap={priorityStyles} /></td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{issue.reportedBy}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FiUser className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">{issue.assignedTo || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                          {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </td>
                      
                      {/* Dynamic Interactive Status Dropdown Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={currentStat}
                            onChange={(e) => handleDirectStatusChange(issue._id, e.target.value)}
                            className={`appearance-none font-semibold text-xs px-3 py-1 pr-6 rounded-full border border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${sStyle.bg} ${sStyle.text}`}
                          >
                            <option value="Open" className="bg-white text-gray-800">● Open</option>
                            <option value="In Progress" className="bg-white text-gray-800">● In Progress</option>
                            <option value="Resolved" className="bg-white text-gray-800">● Resolved</option>
                          </select>
                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-60">▼</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          {/* View Button */}
                          <button 
                            title="View Details" 
                            onClick={() => handleViewIssue(issue)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Assign Personnel Button */}
                          <button 
                            title="Assign Staff" 
                            onClick={() => openAssignmentModal(issue._id)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                          >
                            <FiUserPlus className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Deletion Modal Trigger */}
                          <button 
                            title="Delete" 
                            onClick={() => setIssueToDelete(issue._id)} 
                            className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Overlay: Report New Issue Form Modal ──────────────────────── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-lg w-full overflow-hidden transform scale-100 transition-all">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Report Asset Defect Log</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all cursor-pointer">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Issue Title</label>
                  <input required type="text" placeholder="e.g. Pump Pressure Leakage" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Asset ID</label>
                    <input required type="text" placeholder="e.g. PUMP-101" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category Domain</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      {CATEGORY_OPTIONS.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Urgency Priority</label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      {PRIORITY_OPTIONS.filter(p => p !== "All").map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Reporter Reference</label>
                    <input required type="text" placeholder="Your Name" value={formData.reportedBy} onChange={e => setFormData({...formData, reportedBy: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Assigned Field Staff (Optional)</label>
                  <input type="text" placeholder="e.g. R. Sharma" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm cursor-pointer">Save Log</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Overlay: Read-Only Detail View Inspector Modal ───────────────── */}
        {isViewModalOpen && selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden transform scale-100 transition-all">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Asset Defect Log Details</h3>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all cursor-pointer">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Log Reference ID</span>
                  <span className="text-sm font-mono font-bold text-blue-600">{selectedIssue._id}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Issue Title</span>
                  <span className="text-sm font-medium text-gray-900">{selectedIssue.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Asset ID</span>
                    <span className="text-sm font-mono text-gray-700">{selectedIssue.assetId}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Category Domain</span>
                    <span className="text-sm text-gray-700">{selectedIssue.category}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Urgency Priority</span>
                    <span className="text-sm font-semibold text-gray-700">{selectedIssue.priority}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Status</span>
                    <span className="text-sm font-semibold text-gray-700">{selectedIssue.status || "Open"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Reported By</span>
                    <span className="text-sm text-gray-600">{selectedIssue.reportedBy}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Assigned Technician</span>
                    <span className="text-sm font-medium text-gray-900">{selectedIssue.assignedTo || "Unassigned"}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                  <button type="button" onClick={() => setIsViewModalOpen(false)} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm cursor-pointer">Close View</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Overlay: Improved Assignment Dropdown & Manual Input Modal ── */}
        {assigningIssueId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-sm w-full overflow-hidden transform scale-100 transition-all">
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Assign Field Technician</h3>
                <button onClick={() => setAssigningIssueId(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all cursor-pointer">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Team Member</label>
                  
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignStaff(assigningIssueId, e.target.value);
                      }
                    }}
                    defaultValue=""
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="" disabled>-- Select a Technician --</option>
                    {techniciansList.map((tech) => (
                      <option key={tech._id} value={tech.name}>
                        {tech.name} {tech.role ? `(${tech.role})` : ''}
                      </option>
                    ))}
                    <option value="Unassigned">Leave Unassigned</option>
                  </select>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-2 text-xs text-gray-400 uppercase font-semibold">Or Type Name</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter technician name..."
                    value={customTechName}
                    onChange={(e) => setCustomTechName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAssignStaff(assigningIssueId, customTechName)}
                    disabled={!customTechName.trim()}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Assign
                  </button>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => setAssigningIssueId(null)} 
                    className="px-4 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Overlay: Styled Delete Confirmation Box Modal ───────────────── */}
        {issueToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                <FiAlertTriangle />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center">Delete Issue Log</h3>
              <p className="text-sm text-gray-500 text-center mt-2 px-2">
                Are you sure you want to permanently delete this issue log? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIssueToDelete(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDeleteIssue(issueToDelete)}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}