import { useState, useRef } from "react";
import {
  FiSearch, FiZoomIn, FiZoomOut, FiRotateCw, FiMaximize2,
  FiDownload, FiUpload, FiLayers, FiAlertTriangle, FiCheckCircle,
  FiFileText, FiSettings, FiRefreshCw, FiMapPin, FiCalendar, 
  FiUser, FiGrid, FiPlus, FiX
} from "react-icons/fi";
import {
  MdOutlineElectricBolt, MdOutlineLocalFireDepartment,
  MdOutlineWaterDrop, MdOutlineAir, MdOutlineMiscellaneousServices
} from "react-icons/md";

// Icon lookup dynamically evaluated from category keys
const ICON_MAP = {
  hvac: <MdOutlineAir />,
  mechanical: <MdOutlineMiscellaneousServices />,
  electrical: <MdOutlineElectricBolt />,
  fire: <MdOutlineLocalFireDepartment />,
  plumbing: <MdOutlineWaterDrop />
};

const getCategoryIcon = (key) => ICON_MAP[key?.toLowerCase()] || <FiLayers />;

// Base UI Badges
const StatusBadge = ({ status }) => {
  if (!status) return null;
  const map = {
    operational: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    maintenance: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${map[status.toLowerCase()] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  if (!priority) return null;
  const map = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${map[priority.toLowerCase()] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {priority}
    </span>
  );
};

const HealthBar = ({ value = 0 }) => {
  const color = value >= 80 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
};

const BuildingWireframe = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
    <svg viewBox="0 0 560 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-2xl opacity-20">
      <rect x="100" y="260" width="360" height="80" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="120" y="200" width="320" height="60" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="140" y="140" width="280" height="60" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="160" y="80" width="240" height="60" fill="none" stroke="#6366f1" strokeWidth="1.5" />
      <polygon points="280,30 380,80 180,80" fill="none" stroke="#6366f1" strokeWidth="1.5" />
    </svg>
  </div>
);

export default function BIMViewer({ 
  initialAssets = [], 
  categories = [
    { id: "hvac", label: "HVAC Systems", color: "text-sky-500" },
    { id: "electrical", label: "Electrical Systems", color: "text-amber-500" },
    { id: "plumbing", label: "Plumbing Infrastructure", color: "text-blue-500" },
    { id: "fire", label: "Fire Safety", color: "text-red-500" },
    { id: "mechanical", label: "Mechanical Assets", color: "text-emerald-500" },
  ],
  modelName = ""
}) {
  const [assets, setAssets] = useState(initialAssets);
  const [selectedAssetId, setSelectedAssetId] = useState(initialAssets[0]?.id || null);
  const [activeTab, setActiveTab] = useState("maintenance");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Viewer Canvas State
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loadedFileName, setLoadedFileName] = useState(modelName);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ id: "", name: "", category: categories[0]?.id || "", status: "operational", health: 100, floor: "", tech: "" });

  const fileInputRef = useRef(null);

  // Derived Values - Completely Dynamic
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || null;

  const categoryList = categories.map(cat => ({
    ...cat,
    count: assets.filter(a => a.category?.toLowerCase() === cat.id?.toLowerCase()).length
  }));

  const filteredAssets = assets.filter(a => {
    const matchesSearch = (a.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.id || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || a.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCreateAsset = (e) => {
    e.preventDefault();
    if (!newAsset.id || !newAsset.name) return;

    const createdAsset = {
      ...newAsset,
      installed: new Date().toISOString().split("T")[0],
      maintenanceHistory: [],
      issues: [],
      documents: []
    };

    setAssets(prev => [...prev, createdAsset]);
    setSelectedAssetId(createdAsset.id);
    setIsAddModalOpen(false);
    setNewAsset({ id: "", name: "", category: categories[0]?.id || "", status: "operational", health: 100, floor: "", tech: "" });
  };

  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleExportData = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assets, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", `BIM_Assets_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setLoadedFileName(file.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".ifc,.gltf,.glb,.obj" className="hidden" />

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-indigo-600">
            <FiLayers className="text-white text-base" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-gray-900 leading-tight">BIM Viewer</h1>
            <p className="text-[11px] text-gray-500 leading-tight">Building asset management system</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 bg-white px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">
            <FiUpload className="text-sm" /> Load Model
          </button>
          <button onClick={handleExportData} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 bg-white px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">
            <FiDownload className="text-sm" /> Export Data
          </button>
          <button onClick={handleToggleFullScreen} className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors">
            <FiMaximize2 className="text-sm" /> Full Screen
          </button>
        </div>
      </header>

      <main className="p-4 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-4">

          {/* LEFT: Asset List */}
          <aside className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[650px]">
            <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Building Assets</h2>
              <button onClick={() => setIsAddModalOpen(true)} className="p-1 rounded text-indigo-600 hover:bg-indigo-50 transition-colors" title="Add Asset">
                <FiPlus className="text-sm" />
              </button>
            </div>
            
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="relative">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search assets…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="px-3 pt-3 pb-2 border-b border-gray-100">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Categories</p>
              <div className="space-y-0.5">
                {categoryList.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${activeCategory === cat.id ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${cat.color || "text-gray-400"}`}>{getCategoryIcon(cat.id)}</span>
                      <span className="font-medium">{cat.label}</span>
                    </div>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Assets List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Assets</p>
              {filteredAssets.length > 0 ? (
                filteredAssets.map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`w-full text-left px-2.5 py-2.5 rounded-md transition-all border ${selectedAsset?.id === asset.id ? "bg-indigo-50 border-indigo-200 shadow-sm" : "border-transparent hover:bg-gray-50"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 text-sm ${selectedAsset?.id === asset.id ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"}`}>
                          {getCategoryIcon(asset.category)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{asset.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{asset.id}</p>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${asset.status === "operational" ? "bg-emerald-400" : asset.status === "warning" ? "bg-amber-400" : "bg-red-400"}`} />
                    </div>
                    {selectedAsset?.id === asset.id && <HealthBar value={asset.health} />}
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">No assets available</div>
              )}
            </div>
          </aside>

          {/* CENTER: Canvas and Details */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#0f1623] border border-gray-800 rounded-lg overflow-hidden relative" style={{ minHeight: 420 }}>
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-1">
                  {[
                    { icon: <FiZoomIn />, label: "Zoom In", action: () => setZoom(z => Math.min(z + 10, 200)) },
                    { icon: <FiZoomOut />, label: "Zoom Out", action: () => setZoom(z => Math.max(z - 10, 50)) },
                    { icon: <FiRotateCw />, label: "Rotate", action: () => setRotation(r => r + 45) },
                    { icon: <FiRefreshCw />, label: "Reset", action: () => { setZoom(100); setRotation(0); } },
                  ].map(btn => (
                    <button key={btn.label} title={btn.label} onClick={btn.action} className="flex items-center justify-center w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white/80 text-sm backdrop-blur-sm">
                      {btn.icon}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/50 font-mono">{zoom}%</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-white/50">ACTIVE</span>
                </div>
              </div>

              <div className="relative w-full flex items-center justify-center" style={{ transform: `rotate(${rotation % 360}deg) scale(${zoom / 100})`, transition: "transform 0.3s ease", minHeight: 380 }}>
                <BuildingWireframe />
                <div className="relative z-10 text-center select-none">
                  <p className="text-white/30 text-xs font-mono uppercase tracking-[0.2em]">
                    {loadedFileName || "No Model Loaded"}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/10 px-4 py-2 flex items-center justify-between z-10">
                <div className="text-center">
                  <p className="text-[9px] text-white/40 uppercase font-semibold">Loaded Model</p>
                  <p className="text-[11px] text-white/80 font-mono font-semibold">{loadedFileName || "None"}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/40 uppercase font-semibold">Total Assets</p>
                  <p className="text-[11px] text-white/80 font-mono font-semibold">{assets.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/40 uppercase font-semibold">Selection State</p>
                  <p className="text-[11px] text-white/80 font-mono font-semibold">{selectedAsset ? selectedAsset.id : "None"}</p>
                </div>
              </div>
            </div>

            {/* TABS SECTION */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[210px]">
              <div className="flex border-b border-gray-200">
                {[
                  { id: "maintenance", label: "Maintenance History", icon: <FiCheckCircle /> },
                  { id: "issues", label: "Open Issues", icon: <FiAlertTriangle /> },
                  { id: "documents", label: "Documents", icon: <FiFileText /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 ${activeTab === tab.id ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activeTab === "maintenance" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100">
                          {["Date", "Task", "Technician", "Status"].map(h => (
                            <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-2 pr-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAsset?.maintenanceHistory?.length > 0 ? (
                          selectedAsset.maintenanceHistory.map((row, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-2.5 pr-4 text-gray-500 font-mono">{row.date}</td>
                              <td className="py-2.5 pr-4 text-gray-800 font-medium">{row.task}</td>
                              <td className="py-2.5 pr-4 text-gray-600">{row.technician}</td>
                              <td className="py-2.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                  <FiCheckCircle className="text-xs" /> {row.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={4} className="py-8 text-center text-xs text-gray-400">No maintenance history available for this asset.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "issues" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedAsset?.issues?.length > 0 ? (
                      selectedAsset.issues.map(issue => (
                        <div key={issue.id} className="border border-gray-200 rounded-lg p-3.5">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs font-bold text-gray-800">{issue.title}</p>
                              <p className="text-[10px] font-mono text-gray-400">{issue.id}</p>
                            </div>
                            <PriorityBadge priority={issue.priority} />
                          </div>
                          <p className="text-[11px] text-gray-500">{issue.desc}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 col-span-2 text-center py-8">No active issues logged.</p>
                    )}
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedAsset?.documents?.length > 0 ? (
                      selectedAsset.documents.map(doc => (
                        <div key={doc.name} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center text-center">
                          <FiFileText className="text-2xl text-indigo-500 mb-1" />
                          <p className="text-xs font-semibold text-gray-800">{doc.name}</p>
                          <p className="text-[10px] text-gray-400">{doc.ext} {doc.size ? `· ${doc.size}` : ''}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 col-span-3 text-center py-8">No documents linked to this asset.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Selected Asset Information */}
          <aside className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[650px]">
            <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Asset Information</h2>
              <FiSettings className="text-gray-400 text-sm" />
            </div>

            {selectedAsset ? (
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-4 bg-gradient-to-br from-indigo-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                      {getCategoryIcon(selectedAsset.category)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{selectedAsset.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{selectedAsset.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={selectedAsset.status} />
                </div>

                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Health Score</span>
                    <span className={`text-sm font-black ${selectedAsset.health >= 80 ? "text-emerald-600" : selectedAsset.health >= 50 ? "text-amber-600" : "text-red-600"}`}>
                      {selectedAsset.health ?? 0}%
                    </span>
                  </div>
                  <HealthBar value={selectedAsset.health ?? 0} />
                </div>

                <div className="px-4 py-3 space-y-3">
                  {[
                    { label: "Asset ID", value: selectedAsset.id, icon: <FiGrid /> },
                    { label: "Category", value: selectedAsset.category?.toUpperCase(), icon: <FiLayers /> },
                    { label: "Location", value: selectedAsset.floor, icon: <FiMapPin /> },
                    { label: "Installed", value: selectedAsset.installed, icon: <FiCalendar /> },
                    { label: "Technician", value: selectedAsset.tech, icon: <FiUser /> },
                  ].map(item => (
                    <div key={item.label} className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                        <span className="text-xs">{item.icon}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700 text-right">{item.value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                <FiLayers className="text-4xl mb-3 text-gray-200" />
                <p className="text-xs font-semibold">No asset selected</p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* ── DYNAMIC ADD ASSET MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-sm font-bold text-gray-800">Add New Building Asset</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
            </div>
            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Asset ID *</label>
                <input required type="text" placeholder="e.g. AHU-03" value={newAsset.id} onChange={e => setNewAsset({ ...newAsset, id: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Asset Name *</label>
                <input required type="text" placeholder="e.g. Water Chiller B" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Category</label>
                <select value={newAsset.category} onChange={e => setNewAsset({ ...newAsset, category: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Location / Floor</label>
                <input type="text" placeholder="e.g. Roof Level - Block B" value={newAsset.floor} onChange={e => setNewAsset({ ...newAsset, floor: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Assigned Technician</label>
                <input type="text" placeholder="e.g. Jane Smith" value={newAsset.tech} onChange={e => setNewAsset({ ...newAsset, tech: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 border border-gray-200 rounded text-gray-600">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700">Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}