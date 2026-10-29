import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { FiArrowLeft, FiSave, FiCheckCircle, FiAlertTriangle, FiCpu } from "react-icons/fi";

export default function EditAsset() {
  const location = useLocation();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(() => {
    if (location.state?.asset) {
      sessionStorage.setItem("edit_asset", JSON.stringify(location.state.asset));
      return location.state.asset;
    }
    const saved = sessionStorage.getItem("edit_asset");
    return saved ? JSON.parse(saved) : null;
  });

  const [formData, setFormData] = useState(() => ({
    assetId: asset?.assetId || asset?.id || "",
    name: asset?.name || "",
    category: asset?.category || "HVAC",
    location: asset?.location || "",
    status: asset?.status || "Operational",
    health: asset?.health ?? asset?.healthScore ?? 100,
  }));

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (location.state?.asset) {
      setAsset(location.state.asset);
      sessionStorage.setItem("edit_asset", JSON.stringify(location.state.asset));
      setFormData({
        assetId: location.state.asset.assetId || location.state.asset.id || "",
        name: location.state.asset.name || "",
        category: location.state.asset.category || "HVAC",
        location: location.state.asset.location || "",
        status: location.state.asset.status || "Operational",
        health: location.state.asset.health ?? location.state.asset.healthScore ?? 100,
      });
    }
  }, [location.state]);

  if (!asset) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiAlertTriangle />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Asset Selected</h2>
          <p className="text-sm text-slate-500 mb-6">
            Please select an asset from the Asset Management registry to edit its properties.
          </p>
          <button
            onClick={() => navigate("/assets")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
          >
            <FiArrowLeft size={16} /> Return to Asset Management
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const targetId = asset._id || asset.assetId || asset.id;
    if (!targetId) {
      setErrorMsg("Missing asset unique identifier.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        health: Number(formData.health) || 100,
      };

      const response = await apiFetch(`/api/assets/${targetId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updated = await response.json();
        setSuccessMsg("Asset details saved successfully!");
        sessionStorage.setItem("edit_asset", JSON.stringify(updated));
        setTimeout(() => {
          navigate("/assets");
        }, 1200);
      } else {
        const err = await response.json().catch(() => ({}));
        setErrorMsg(err.error || err.message || "Failed to update asset.");
      }
    } catch (err) {
      console.error("Error committing asset update:", err);
      setErrorMsg("Network error connecting to backend service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header navigation bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/assets")}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <FiArrowLeft size={16} /> Back to Assets
          </button>
          <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
            ID: {formData.assetId}
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-blue-50/50 to-white">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FiCpu size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Edit Asset Record</h1>
              <p className="text-xs text-slate-500">Update hardware equipment details and operational parameters</p>
            </div>
          </div>

          {/* Feedback Banners */}
          {successMsg && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
              <FiCheckCircle className="shrink-0" /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <FiAlertTriangle className="shrink-0" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Asset Identifier
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.assetId}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-mono text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Category Domain
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. HVAC, Electrical, Plumbing"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Asset Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Primary Water Chiller Plant"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Physical Location / Area
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Floor 2, Server Room 204"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Operational Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer"
                >
                  <option value="Operational">Operational</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Health Condition (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.health}
                  onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/assets")}
                className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <FiSave size={15} />
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
