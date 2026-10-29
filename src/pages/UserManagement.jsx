import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import {
  FiUsers, FiUserCheck, FiTool, FiHome,
  FiPlus, FiDownload, FiSearch, FiFilter,
  FiEye, FiEdit2, FiTrash2, FiX,
  FiTrendingUp, FiTrendingDown,
  FiChevronDown, FiCheckCircle,
  FiShield, FiKey, FiUserPlus,
  FiActivity, FiMail, FiPhone
} from "react-icons/fi";

// ── Config Mappings ──────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  Admin:            { color: "bg-violet-100 text-violet-700",  dot: "bg-violet-500" },
  "Facility Manager": { color: "bg-cyan-100 text-cyan-700",   dot: "bg-cyan-500" },
  Technician:       { color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
};

const STATUS_CONFIG = {
  Active:   { color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Inactive: { color: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",     dot: "bg-slate-400" },
};

const DEPARTMENTS = ["IT Operations", "Building A", "Building B", "HVAC Systems", "Electrical", "Plumbing", "Grounds & Safety"];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, trend, trendLabel, iconBg, iconColor }) {
  const isUp = trend >= 0;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800 tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-1.5">
          {isUp
            ? <FiTrendingUp size={13} className="text-emerald-500" />
            : <FiTrendingDown size={13} className="text-rose-500" />}
          <span className={`text-xs font-medium ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
            {isUp ? "+" : ""}{trend}%
          </span>
          <span className="text-xs text-slate-400">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}

function RoleDistCard({ icon: Icon, role, count, pct, iconBg, iconColor, barColor }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-700">{role}</div>
          <div className="text-xs text-slate-400">System Role</div>
        </div>
        <div className="ml-auto text-2xl font-bold text-slate-800">{count}</div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Share of users</span>
          <span className="font-medium text-slate-700">{pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onUserAdded }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", role: "", department: "" });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      alert("Please enter full name and email.");
      return;
    }

    setSaving(true);
    try {
      const response = await apiFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          role: form.role || "Technician",
          department: form.department || "General",
          status: "Active",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const newUserData = await response.json();
      onUserAdded(newUserData);
      onClose();
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user. Please check your backend.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Add New User</h2>
            <p className="text-xs text-slate-500 mt-0.5">Provision a new account and assign a role.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Full Name</label>
              <input className={inputCls} placeholder="e.g. John Doe" value={form.fullName} onChange={set("fullName")} required />
            </div>
            <div>
              <label className={labelCls}>Email Address</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className={`${inputCls} pl-9`} placeholder="user@facility.com" value={form.email} onChange={set("email")} required />
              </div>
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <div className="relative">
                <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className={`${inputCls} pl-9`} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <div className="relative">
                <select className={`${inputCls} appearance-none pr-8`} value={form.role} onChange={set("role")}>
                  <option value="">Select role…</option>
                  <option>Admin</option>
                  <option>Facility Manager</option>
                  <option>Technician</option>
                </select>
                <FiChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Department</label>
              <div className="relative">
                <select className={`${inputCls} appearance-none pr-8`} value={form.department} onChange={set("department")}>
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <FiChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition flex items-center gap-2 disabled:opacity-50"
            >
              <FiUserPlus size={14} />
              {saving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [search, setSearch]           = useState("");
  const [filterRole, setFilterRole]   = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch Users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User API
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await apiFetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((u) => (u._id || u.id) !== id));
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Helper for Initials
  const getAvatarInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active" || !u.status).length;
  const techs = users.filter((u) => u.role === "Technician").length;
  const fms = users.filter((u) => u.role === "Facility Manager").length;
  const admins = users.filter((u) => u.role === "Admin").length;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const name = u.fullName || u.name || "";
    const email = u.email || "";
    const department = u.department || "";

    const matchQ = !q || name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || department.toLowerCase().includes(q);
    const matchR = filterRole === "All" || u.role === filterRole;
    const matchS = filterStatus === "All" || (u.status || "Active") === filterStatus;
    return matchQ && matchR && matchS;
  });

  // Extract recent activities from all users
  const recentActivities = users
    .flatMap((u) => (u.recentActivity || []).map((act) => ({ ...act, user: u.fullName || u.name })))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
            <p className="mt-0.5 text-sm text-slate-500">Manage system users, roles, permissions, and account status.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm">
              <FiDownload size={14} />
              Export Users
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition shadow-sm"
            >
              <FiPlus size={15} />
              Add User
            </button>
          </div>
        </div>

        {/* ── Section 1: Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FiUsers}     label="Total Users"       value={totalUsers}  trend={12} trendLabel="vs last month" iconBg="bg-indigo-50"  iconColor="text-indigo-600" />
          <StatCard icon={FiUserCheck} label="Active Users"      value={activeUsers} trend={8}  trendLabel="vs last month" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <StatCard icon={FiTool}      label="Technicians"       value={techs}       trend={4}  trendLabel="vs last month" iconBg="bg-amber-50"   iconColor="text-amber-600" />
          <StatCard icon={FiHome}      label="Facility Managers" value={fms}         trend={-2} trendLabel="vs last month" iconBg="bg-cyan-50"    iconColor="text-cyan-600" />
        </div>

        {/* ── Section 2: User Table ── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-sm">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <FiFilter size={12} />
                <span>Filters:</span>
              </div>
              {/* Role filter */}
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-7 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer transition"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option>Admin</option>
                  <option>Facility Manager</option>
                  <option>Technician</option>
                </select>
                <FiChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {/* Status filter */}
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-7 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer transition"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <FiChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading users from server...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    {["User", "Email", "Role", "Department", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b border-slate-100">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((u) => {
                    const userId = u._id || u.id;
                    const rc = ROLE_CONFIG[u.role] || { color: "bg-gray-100 text-gray-700", dot: "bg-gray-400" };
                    const statusVal = u.status || "Active";
                    const sc = STATUS_CONFIG[statusVal] || STATUS_CONFIG.Active;

                    return (
                      <tr key={userId} className="hover:bg-slate-50/70 transition-colors">
                        {/* User */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {u.profileImage ? (
                              <img src={u.profileImage} alt="avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {getAvatarInitials(u.fullName || u.name)}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-800 text-sm">{u.fullName || u.name}</div>
                            </div>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{u.email}</td>
                        {/* Role */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${rc.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                            {u.role || "User"}
                          </span>
                        </td>
                        {/* Department */}
                        <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{u.department || "General"}</td>
                        {/* Status */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {statusVal}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/profile/${userId}`)}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                              title="View Profile"
                            >
                              <FiEye size={14} />
                            </button>
                            <button
                              onClick={() => navigate(`/profile/${userId}`)}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-cyan-50 hover:text-cyan-600 transition"
                              title="Edit User"
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(userId)}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                              title="Delete User"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                        No users match your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Table footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of <span className="font-semibold text-slate-700">{totalUsers}</span> users
            </span>
          </div>
        </div>

        {/* ── Sections 3 & 4: Side by Side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Section 3: Role Distribution */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Role Distribution</h2>
                <p className="text-xs text-slate-500 mt-0.5">Users by system role</p>
              </div>
              <FiActivity size={15} className="text-slate-400" />
            </div>
            <div className="space-y-3">
              <RoleDistCard
                icon={FiShield}
                role="Admin"
                count={admins}
                pct={totalUsers ? Math.round((admins / totalUsers) * 100) : 0}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                barColor="bg-violet-500"
              />
              <RoleDistCard
                icon={FiHome}
                role="Facility Manager"
                count={fms}
                pct={totalUsers ? Math.round((fms / totalUsers) * 100) : 0}
                iconBg="bg-cyan-50"
                iconColor="text-cyan-600"
                barColor="bg-cyan-500"
              />
              <RoleDistCard
                icon={FiTool}
                role="Technician"
                count={techs}
                pct={totalUsers ? Math.round((techs / totalUsers) * 100) : 0}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                barColor="bg-emerald-500"
              />
            </div>
          </div>

          {/* Section 4: Recent Activity */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Recent User Activity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest account and role changes</p>
              </div>
            </div>
            <div className="relative">
              {recentActivities.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No activity logged yet.</div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((a, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <FiCheckCircle size={16} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-700">{a.user}</span>
                          <span className="text-xs text-slate-400 whitespace-nowrap">{a.time || "Recently"}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">{a.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── Section 5: Modal ── */}
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onUserAdded={(newUser) => setUsers([newUser, ...users])}
        />
      )}
    </div>
  );
}