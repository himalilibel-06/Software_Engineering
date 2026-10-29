import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiEdit2, FiClock, FiAlertCircle,
  FiActivity, FiCalendar, FiUser, FiCpu, FiShield,
  FiFileText, FiDownload, FiBox, FiRefreshCw, FiLink,
  FiThermometer, FiTool, FiEye, FiPlus
} from "react-icons/fi";
import {
  MdOutlineHealthAndSafety,
  MdOutlineHistory, MdOutlineWarning
} from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsBuilding, BsFillCircleFill } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";

// ─── Dummy Data ────────────────────────────────────────────────────────────────


const maintenanceHistory = [
  { date: "2025-05-12", task: "Filter Replacement", technician: "R. Sharma", status: "Completed" },
  { date: "2025-04-15", task: "Routine Inspection", technician: "R. Sharma", status: "Completed" },
  { date: "2025-03-01", task: "Coil Cleaning",       technician: "A. Kumar",  status: "Completed" },
  { date: "2025-02-10", task: "Belt Tension Check",  technician: "R. Sharma", status: "Completed" },
  { date: "2025-01-20", task: "Lubrication Service", technician: "S. Patel",  status: "Completed" },
];

const openIssues = [
  { id: "ISS-041", title: "Temperature Fluctuation", priority: "Medium", status: "Open",        reported: "2025-05-18", description: "Inlet temperature varying ±3°C outside normal range." },
  { id: "ISS-039", title: "Sensor Calibration",      priority: "Low",    status: "In Progress", reported: "2025-05-10", description: "Humidity sensor reading 4% above calibrated baseline." },
];

const documents = [
  { name: "Installation Manual",    type: "PDF", size: "3.2 MB", icon: HiOutlineDocumentText },
  { name: "Maintenance Checklist",  type: "PDF", size: "1.1 MB", icon: FiFileText },
  { name: "Warranty Certificate",   type: "PDF", size: "0.8 MB", icon: FiShield },
];

const activityTimeline = [
  { id: 1, event: "Maintenance Completed",  description: "Filter replacement by R. Sharma",           time: "2025-05-12 · 10:24 AM", icon: FiTool,        color: "text-emerald-600 bg-emerald-50" },
  { id: 2, event: "Issue Created",          description: "Temperature fluctuation flagged — ISS-041",  time: "2025-05-18 · 02:15 PM", icon: FiAlertCircle, color: "text-amber-600 bg-amber-50" },
  { id: 3, event: "Inspection Scheduled",   description: "Quarterly inspection set for 15 Jun 2025",   time: "2025-05-20 · 09:00 AM", icon: FiCalendar,    color: "text-blue-600 bg-blue-50" },
  { id: 4, event: "Asset Updated",          description: "BIM model re-synced — Building_A.rvt",       time: "2025-05-20 · 11:47 AM", icon: FiRefreshCw,   color: "text-violet-600 bg-violet-50" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon className="text-blue-600" size={18} />
    <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest">{label}</h2>
  </div>
);

const KPICard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
      <Icon size={17} />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-semibold text-slate-700">{value}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Operational:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    Maintenance:   "bg-amber-50 text-amber-700 border-amber-200",
    Offline:       "bg-red-50 text-red-700 border-red-200",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
    Open:          "bg-orange-50 text-orange-700 border-orange-200",
    Completed:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${map[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      <BsFillCircleFill size={5} />
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const map = { High: "bg-red-50 text-red-700", Medium: "bg-amber-50 text-amber-700", Low: "bg-sky-50 text-sky-700" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[priority] ?? "bg-slate-100 text-slate-600"}`}>
      {priority}
    </span>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AssetDetails() {
  const location = useLocation();
  const navigate = useNavigate();
const asset = location.state?.asset;
if (!asset) {
  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold">No Asset Data Found</h2>
      <p>Please go back to Asset Management and click the View icon.</p>
    </div>
  );
}

  const healthColor =
    asset.healthScore >= 80 ? "bg-emerald-500" :
    asset.healthScore >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Top Navigation Bar ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BsBuilding size={15} className="text-blue-600" />
            <span>FacilityOS</span>
            <span className="text-slate-300">/</span>
            <span>Assets</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">{asset.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
  onClick={() => navigate("/assets")}
  className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
>
  <FiArrowLeft size={14} />
  Back to Assets
</button>
            <button
  onClick={() =>
    navigate("/edit-asset", {
      state: { asset },
    })
  }
  className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
>
  <FiEdit2 size={13} />
  Edit Asset
</button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">

        {/* ── HEADER ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
                <FiCpu size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 leading-tight">{asset.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">{asset.id}</span>
                  <StatusBadge status={asset.status} />
                  <span className="text-xs text-slate-400">{asset.category} · {asset.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <TbReportAnalytics size={14} /> Generate Report
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <FiPlus size={13} /> New Work Order
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={MdOutlineHealthAndSafety} label="Health Score" value={`${asset.healthScore}%`} accent="bg-emerald-100 text-emerald-600" />
          <KPICard icon={FiClock}                  label="Asset Age"    value={asset.age}               accent="bg-blue-100 text-blue-600" />
          <KPICard icon={FiTool}                   label="Maintenance Count" value={asset.maintenanceCount} accent="bg-violet-100 text-violet-600" />
          <KPICard icon={FiAlertCircle}             label="Open Issues"  value={asset.openIssues}         accent="bg-amber-100 text-amber-600" />
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left Column (spans 2) */}
          <div className="xl:col-span-2 space-y-6">

            {/* ── SECTION 2: Asset Information ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeading icon={FiActivity} label="Asset Information" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                <InfoRow label="Asset ID"           value={asset.id} />
                <InfoRow label="Asset Name"         value={asset.name} />
                <InfoRow label="Category"           value={asset.category} />
                <InfoRow label="Location"           value={asset.location} />
                <InfoRow label="Manufacturer"       value={asset.manufacturer} />
                <InfoRow label="Model"              value={asset.model} />
                <InfoRow label="Installation Date"  value={asset.installationDate} />
                <InfoRow label="Warranty Expiry"    value={asset.warrantyExpiry} />
                <InfoRow label="Assigned Technician" value={asset.technician} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Current Status</span>
                  <StatusBadge status={asset.status} />
                </div>
              </div>
            </div>

            {/* ── SECTION 3: Asset Health ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeading icon={MdOutlineHealthAndSafety} label="Asset Health" />
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Health Score</span>
                    <span className="text-sm font-bold text-emerald-600">{asset.healthScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${healthColor}`}
                      style={{ width: `${asset.healthScore}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Performance", value: asset.performance, color: "text-emerald-600 bg-emerald-50" },
                    { label: "Risk Level",   value: asset.riskLevel,   color: "text-sky-600 bg-sky-50" },
                    { label: "Condition",    value: "Good",            color: "text-blue-600 bg-blue-50" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">{label}</p>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── SECTION 4: Maintenance History ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MdOutlineHistory className="text-blue-600" size={18} />
                  <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest">Maintenance History</h2>
                </div>
                <button className="text-xs text-blue-600 font-semibold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Date", "Task", "Technician", "Status"].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {maintenanceHistory.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-slate-500 font-mono text-xs">{row.date}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{row.task}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                              <FiUser size={10} className="text-blue-600" />
                            </div>
                            <span className="text-slate-600">{row.technician}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3"><StatusBadge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── SECTION 5: Open Issues ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MdOutlineWarning className="text-blue-600" size={18} />
                  <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest">Open Issues</h2>
                </div>
                <button className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">
                  <FiPlus size={12} /> Log Issue
                </button>
              </div>
              <div className="space-y-3">
                {openIssues.map(issue => (
                  <div key={issue.id} className="border border-slate-100 rounded-xl p-4 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FiThermometer size={15} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{issue.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{issue.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge status={issue.status} />
                        <PriorityBadge priority={issue.priority} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><FiCalendar size={11} /> Reported: {issue.reported}</span>
                      <span className="font-mono">{issue.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* ── SECTION 6: BIM Information ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeading icon={FiBox} label="BIM Information" />
              <div className="space-y-3 mb-4">
                {[
                  { label: "Linked BIM Model", value: "Building_A.rvt", icon: FiLink },
                  { label: "Model ID",          value: "BIM-001",        icon: FiCpu },
                  { label: "Last Synced",       value: "2025-05-20",     icon: FiRefreshCw },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon size={13} className="text-slate-400" />
                      {label}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 font-mono">{value}</span>
                  </div>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100">
                <FiEye size={14} />
                Open BIM Viewer
              </button>
            </div>

            {/* ── SECTION 7: Documents ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeading icon={HiOutlineDocumentText} label="Documents" />
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <doc.icon size={15} className="text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.type} · {doc.size}</p>
                      </div>
                    </div>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <FiDownload size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 8: Recent Activity Timeline ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeading icon={FiClock} label="Recent Activity" />
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />
                <div className="space-y-5">
                  {activityTimeline.map((entry) => (
                    <div key={entry.id} className="flex gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${entry.color}`}>
                        <entry.icon size={14} />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm font-semibold text-slate-800">{entry.event}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{entry.description}</p>
                        <p className="text-xs text-slate-400 mt-1 font-mono">{entry.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <FiShield size={16} className="text-blue-200" />
                <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Warranty Status</span>
              </div>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-sm text-blue-200 mt-1">Expires 12 Jan 2028</p>
              <div className="mt-4 pt-4 border-t border-blue-500">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-300">Coverage Remaining</span>
                  <span className="font-bold text-white">~2.6 Years</span>
                </div>
                <div className="mt-2 w-full h-1.5 bg-blue-500 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: "37%" }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-screen-xl mx-auto px-6 py-4 border-t border-slate-100 mt-4">
        <p className="text-xs text-slate-400">
          FacilityOS BIM Management · Asset last updated 20 May 2025 · All times in IST
        </p>
      </div>
    </div>
  );
}
