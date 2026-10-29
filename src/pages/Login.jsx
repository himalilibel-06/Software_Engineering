import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdEngineering,
  MdAdminPanelSettings,
  MdBuild,
} from "react-icons/md";
import { TbBuildingSkyscraper } from "react-icons/tb";

const ROLES = [
  {
    id: "Facility Manager",
    label: "Facility Manager",
    icon: MdEngineering,
    description: "Asset oversight & maintenance",
  },
  {
    id: "Technician",
    label: "Technician",
    icon: MdBuild,
    description: "Field operations & service",
  },
  {
    id: "Administrator",
    label: "Administrator",
    icon: MdAdminPanelSettings,
    description: "System configuration & users",
  },
];

// ── BIM SVG Illustration ──────────────────────────────────────────────────────
function BIMIllustration() {
  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto"
      aria-hidden="true"
    >
      {/* Floor grid */}
      <rect x="30" y="240" width="360" height="6" rx="2" fill="#E2E8F0" />
      {[60, 120, 180, 240, 300, 360].map((x) => (
        <line
          key={x}
          x1={x}
          y1="240"
          x2={x}
          y2="246"
          stroke="#CBD5E1"
          strokeWidth="1"
        />
      ))}

      {/* Building A – tall tower */}
      <rect x="58" y="90" width="72" height="152" rx="3" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
      {/* windows A */}
      {[104, 125, 146, 167, 188, 209].map((y) =>
        [66, 82, 98, 112].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="8" rx="1" fill="#93C5FD" opacity="0.7" />
        ))
      )}
      {/* rooftop detail */}
      <rect x="68" y="84" width="52" height="10" rx="2" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
      <rect x="84" y="76" width="20" height="10" rx="1" fill="#BFDBFE" />

      {/* Building B – mid-rise */}
      <rect x="160" y="128" width="100" height="114" rx="3" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1.5" />
      {[136, 155, 174, 193, 212].map((y) =>
        [168, 186, 204, 222, 240].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="1" fill="#6EE7B7" opacity="0.6" />
        ))
      )}
      {/* antenna */}
      <line x1="210" y1="128" x2="210" y2="108" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="210" cy="106" r="4" fill="#34D399" />

      {/* Building C – squat block */}
      <rect x="292" y="160" width="90" height="82" rx="3" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1.5" />
      {[168, 186, 204, 220].map((y) =>
        [300, 318, 336, 354, 370].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="9" height="9" rx="1" fill="#FDBA74" opacity="0.6" />
        ))
      )}

      {/* Connecting data lines (BIM network) */}
      <path d="M130 165 Q145 140 160 165" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
      <path d="M260 185 Q276 170 292 185" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />

      {/* Data nodes */}
      <circle cx="130" cy="165" r="5" fill="#3B82F6" />
      <circle cx="260" cy="185" r="5" fill="#10B981" />
      <circle cx="292" cy="185" r="5" fill="#F59E0B" />
      <circle cx="160" cy="165" r="5" fill="#3B82F6" />

      {/* Floating data chips */}
      <rect x="30" y="36" width="84" height="28" rx="5" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="36" y="44" width="8" height="8" rx="1" fill="#3B82F6" />
      <rect x="50" y="46" width="36" height="4" rx="2" fill="#CBD5E1" />
      <rect x="50" y="53" width="24" height="3" rx="1.5" fill="#E2E8F0" />

      <rect x="308" y="50" width="90" height="28" rx="5" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="314" y="58" width="8" height="8" rx="1" fill="#10B981" />
      <rect x="328" y="60" width="40" height="4" rx="2" fill="#CBD5E1" />
      <rect x="328" y="67" width="28" height="3" rx="1.5" fill="#E2E8F0" />

      <rect x="155" y="26" width="110" height="28" rx="5" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="161" y="34" width="8" height="8" rx="1" fill="#F59E0B" />
      <rect x="175" y="36" width="46" height="4" rx="2" fill="#CBD5E1" />
      <rect x="175" y="43" width="32" height="3" rx="1.5" fill="#E2E8F0" />

      {/* Tiny people silhouettes on ground */}
      {[100, 175, 310].map((x, i) => (
        <g key={x} opacity="0.5">
          <circle cx={x} cy="233" r="4" fill={["#93C5FD", "#6EE7B7", "#FDBA74"][i]} />
          <rect x={x - 3} y="237" width="6" height="9" rx="1" fill={["#93C5FD", "#6EE7B7", "#FDBA74"][i]} />
        </g>
      ))}
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Facility Manager");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({ 
    email: "", 
    password: "" 
  });

  const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMessage("");
  setLoading(true);

  const payload = {
    ...formData,
    role: selectedRole,
  };

  try {
    const response = await apiFetch("/api/auth/Login", {
      auth: false,
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      // 1. SAVE THE TOKEN FROM BACKEND
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // 2. SAVE USER DETAILS
      localStorage.setItem("user", JSON.stringify(data.user || payload));
      
      navigate("/dashboard");
    } else {
      setErrorMessage(data.message || "Invalid credentials.");
    }
  } catch (error) {
    setErrorMessage("Cannot connect to server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.35,
        }}
      />

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[600px] z-10">

        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div className="relative flex flex-col justify-between lg:w-[52%] bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 px-8 py-10 lg:px-12 lg:py-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-400/5 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-24 right-10 w-28 h-28 rounded-full bg-emerald-400/8 pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 shadow-lg shadow-blue-500/30">
              <TbBuildingSkyscraper className="text-white text-xl" />
            </div>
            <div>
              <span className="text-white font-semibold text-base tracking-tight">
                BIM<span className="text-blue-400">FM</span>
              </span>
              <p className="text-slate-400 text-[10px] tracking-widest uppercase leading-none mt-0.5">
                Facility Suite
              </p>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative z-10 my-6 lg:my-0 lg:flex-1 flex items-center justify-center">
            <BIMIllustration />
          </div>

          {/* Tagline */}
          <div className="relative z-10">
            <h1 className="text-white text-2xl lg:text-3xl font-semibold leading-snug tracking-tight">
              Intelligent Facility
              <br />
              <span className="text-blue-400">Asset Management</span> Platform
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-xs">
              Unify your building data, maintenance workflows, and asset lifecycle in one connected workspace.
            </p>

            {/* Stats strip */}
            <div className="mt-6 flex gap-6">
              {[
                { val: "3.2K+", label: "Assets tracked" },
                { val: "98%", label: "Uptime SLA" },
                { val: "ISO", label: "19650 Ready" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p className="text-white font-semibold text-sm">{val}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center lg:w-[48%] px-6 py-10 sm:px-10 lg:px-12 lg:py-12">

          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">
              Secure Portal
            </p>
            <h2 className="text-gray-900 text-2xl font-semibold tracking-tight">
              Sign in to your workspace
            </h2>
            <p className="text-gray-500 text-sm mt-1.5">
              Access your facility management dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MdEmail className="text-lg" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MdLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Role Selection UI */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 tracking-wide uppercase">
                Sign in as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(({ id, label, icon: Icon, description }) => {
                  const isActive = selectedRole === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedRole(id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all duration-150 focus:outline-none ${
                        isActive
                          ? "border-blue-500 bg-blue-50/60 shadow-sm ring-1 ring-blue-500"
                          : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white"
                      }`}
                      aria-pressed={isActive}
                    >
                      <Icon
                        className={`text-xl transition-colors ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-semibold leading-tight transition-colors ${
                          isActive ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {label}
                      </span>
                      <span
                        className={`text-[10px] leading-tight hidden sm:block transition-colors ${
                          isActive ? "text-blue-500" : "text-gray-400"
                        }`}
                      >
                        {description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              
              <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-500/20 flex items-center justify-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Create Account Link */}
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] text-gray-400">
            Protected by{" "}
            <span className="font-semibold text-gray-500">ISO/IEC 27001</span>{" "}
            · Compliant with{" "}
            <span className="font-semibold text-gray-500">GDPR</span>
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            <button
              type="button"
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Privacy Policy
            </button>

          </p>
        </div>
      </div>
    </div>
  );
}