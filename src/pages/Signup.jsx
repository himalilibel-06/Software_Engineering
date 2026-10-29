/**
 * Signup.jsx
 * Smart BIM Facility Management Platform
 *
 * Registration page — mirrors the Login page's split-screen enterprise layout.
 * Left panel: dark-blue branding with feature highlights
 * Right panel: controlled registration form with validation, strength meter, role picker
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ─── Password strength helper ────────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/3", textColor: "text-red-600" };
  if (score <= 3) return { label: "Medium", color: "bg-yellow-500", width: "w-2/3", textColor: "text-yellow-600" };
  return { label: "Strong", color: "bg-emerald-500", width: "w-full", textColor: "text-emerald-600" };

}

// ─── Feature list for left panel ─────────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    text: "Centralized Asset Management",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    text: "Preventive Maintenance Tracking",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    text: "BIM-Integrated Building Data",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    text: "Issue & Work Order Management",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    text: "Analytics & Reports",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    text: "Future-ready Digital Twin Platform",
  },
];

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLES = [
  { value: "", label: "Select your role" },
  { value: "Facility Manager", label: "Facility Manager" },
  { value: "Technician", label: "Technician" },
  { value: "Administrator", label: "Administrator" },
];

// ─── Eye icon (show / hide password) ─────────────────────────────────────────
function EyeIcon({ visible }) {
  return visible ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Signup() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = getPasswordStrength(formData.password);

  // ── Input change handler ──────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  }

  // ── Client-side validation ────────────────────────────────────────────────
  function validate() {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) errors.fullName = "Full name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.role) errors.role = "Please select a role.";

    return errors;
  }

  // ── Signup handler ────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError("");

    // Run client-side validation
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const { fullName, email, password, role } = formData;
      const response = await apiFetch("/api/auth/signup", {
        auth: false,
        method: "POST",
        body: JSON.stringify({ fullName, email, password, role }),
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw { response: { data: errBody } };
      }
      toast.success("Account created successfully!");
      
      // Add a small delay so the user sees the toast before navigating
      setTimeout(() => {
        navigate("/"); // Sends them to Login
      }, 1500);
      
    } catch (error) {
      console.error("Signup error:", error);
      const msg = error.response?.data?.message || "Signup failed";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL: Branding ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-2/5 flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0c2340 100%)",
        }}
      >
        {/* Subtle background geometry */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 -left-16 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #1d4ed8 0%, transparent 70%)" }}
          />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo + Title */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            </div>
            <span className="text-white text-sm font-semibold tracking-widest uppercase opacity-80">
              Smart BIM FM
            </span>
          </div>

          <h1 className="text-white text-3xl xl:text-4xl font-bold leading-tight mb-4">
            Smart BIM<br />
            <span className="text-blue-400">Facility Management</span><br />
            Platform
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            Create your account to access intelligent building operations and BIM-integrated facility management.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 mt-8 space-y-3">
          <p className="text-blue-300 text-xs uppercase tracking-widest font-semibold mb-4">
            Platform Capabilities
          </p>
          {FEATURES.map((f) => (
            <div key={f.text} className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-md bg-blue-900/60 border border-blue-700/40 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:bg-blue-800/60 transition-colors">
                {f.icon}
              </div>
              <span className="text-blue-100 text-sm">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Footer badge */}
        <div className="relative z-10 mt-8">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/30 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-blue-200 text-xs">Enterprise-grade security & compliance</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Registration Form ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            </div>
            <span className="text-slate-700 font-semibold text-sm">Smart BIM FM Platform</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 p-8 xl:p-10">
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h2>
              <p className="text-slate-500 text-sm">Join the Smart BIM Facility Management Platform</p>
              <ToastContainer position="top-right" autoClose={2000} />
            </div>

            {/* Server-level error */}
            {serverError && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSignup} noValidate className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2.5 rounded-lg border text-slate-800 text-sm placeholder-slate-400 outline-none transition-all
                    focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    ${fieldErrors.fullName ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                />
                {fieldErrors.fullName && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@organisation.com"
                  className={`w-full px-4 py-2.5 rounded-lg border text-slate-800 text-sm placeholder-slate-400 outline-none transition-all
                    focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    ${fieldErrors.email ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-slate-800 text-sm placeholder-slate-400 outline-none transition-all
                      focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                      ${fieldErrors.password ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>

                {/* Strength meter */}
                {formData.password && strength && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                      />
                    </div>
                    <p className={`text-xs mt-1 font-medium ${strength.textColor}`}>
                      {strength.label} password
                    </p>
                  </div>
                )}

                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-slate-800 text-sm placeholder-slate-400 outline-none transition-all
                      focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                      ${fieldErrors.confirmPassword ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    <EyeIcon visible={showConfirmPassword} />
                  </button>
                </div>

                {/* Match indicator */}
                {formData.confirmPassword && !fieldErrors.confirmPassword && (
                  <p className={`text-xs mt-1.5 font-medium ${
                    formData.password === formData.confirmPassword ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {formData.password === formData.confirmPassword ? "✓ Passwords match" : "Passwords do not match"}
                  </p>
                )}

                {fieldErrors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Role selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all appearance-none cursor-pointer
                    focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    ${formData.role ? "text-slate-800" : "text-slate-400"}
                    ${fieldErrors.role ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "18px",
                  }}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value} disabled={r.value === ""}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.role && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.role}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-all duration-200 mt-2
                  ${isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md shadow-blue-200 hover:shadow-blue-300"
                  }`}
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isLoading ? "Creating Account…" : "Create Account"}
              </button>
            </form>

            {/* Navigate to login */}
            <p className="text-sm text-center text-gray-600 mt-4">
  Already have an account?{" "}
  <Link to="/" className="text-blue-600 font-semibold hover:underline">
    Sign in here
  </Link>
</p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 mt-5">
            By creating an account you agree to the platform's terms of use and data processing policy.
          </p>
        </div>
      </div>
    </div>
  );
}
