import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiGlobe,
  FiMonitor,
  FiBell,
  FiShield,
  FiBox,
  FiGrid,
  FiLock,
  FiInfo,
  FiAlertTriangle,
  FiCamera,
  FiSave,
  FiRotateCcw,
  FiEdit2,
  FiSmartphone,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiLogOut,
  FiTrash2,
  FiRefreshCw,
  FiDatabase,
  FiServer,
  FiWifi,
} from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Reusable building blocks                                          */
/* ------------------------------------------------------------------ */

const SettingsCard = ({ icon: Icon, title, description, children, id }) => (
  <section
    id={id}
    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 sm:p-8"
  >
    <div className="flex items-start gap-3 mb-6">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-700 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
    {children}
  </section>
);

const ToggleSwitch = ({ label, description, checked, onChange, id }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="pr-4">
      <label htmlFor={id} className="text-sm font-medium text-slate-800 cursor-pointer">
        {label}
      </label>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-700" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const Field = ({ label, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-medium text-slate-600">{label}</label>
    {children}
  </div>
);

const inputClasses =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 disabled:bg-gray-50 disabled:text-slate-400";

const TextInput = (props) => <input {...props} className={inputClasses} />;

const Select = ({ children, ...props }) => (
  <select {...props} className={inputClasses}>
    {children}
  </select>
);

const SegmentedControl = ({ options, value, onChange }) => (
  <div className="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1">
    {options.map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
          value === opt
            ? "bg-blue-700 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-gray-100"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const StatusPill = ({ status }) => {
  const isOnline = status === "Online" || status === "Connected" || status === "Operational";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isOnline ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {isOnline ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiXCircle className="w-3.5 h-3.5" />}
      {status}
    </span>
  );
};

const ConfirmDialog = ({ open, title, message, confirmLabel, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-[fadeIn_0.15s_ease-out]">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 shrink-0">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-50 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-150"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

const SETTINGS_NAV = [
  { id: "profile", label: "Profile Information", icon: FiUser },
  { id: "preferences", label: "Account Preferences", icon: FiGlobe },
  { id: "appearance", label: "Appearance", icon: FiMonitor },
  { id: "notifications", label: "Notifications", icon: FiBell },
  { id: "security", label: "Security", icon: FiShield },
  { id: "bim", label: "BIM Preferences", icon: FiBox },
  { id: "assets", label: "Asset Preferences", icon: FiGrid },
  { id: "privacy", label: "Privacy", icon: FiLock },
  { id: "system", label: "System Information", icon: FiInfo },
  { id: "danger", label: "Danger Zone", icon: FiAlertTriangle },
];

const DEFAULT_PROFILE = {
  fullName: "Arun Kumaresan",
  email: "arun.kumaresan@smartbim.com",
  employeeId: "EMP-10239",
  company: "SmartBIM Facilities Pvt. Ltd.",
  department: "Facilities Operations",
  jobTitle: "Senior Facility Manager",
  role: "Facility Manager",
  avatar: null,
};

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* ---------------- Profile ---------------- */
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("user_profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  /* ---------------- Preferences ---------------- */
  const [preferences, setPreferences] = useState({
    language: "English (US)",
    timeZone: "GMT+5:30 (Chennai, Kolkata, Mumbai)",
    dateFormat: "DD/MM/YYYY",
    landingPage: "Dashboard Overview",
  });

  /* ---------------- Appearance ---------------- */
  const [theme, setTheme] = useState("Light");
  const [density, setDensity] = useState("Comfortable");
  const [sidebarMode, setSidebarMode] = useState("Expanded");

  /* ---------------- Notifications ---------------- */
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    maintenanceAlerts: true,
    criticalAlerts: true,
    assetStatusChanges: false,
    weeklyReports: true,
    monthlyReports: false,
  });

  /* ---------------- Security ---------------- */
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passwordFeedback, setPasswordFeedback] = useState({ type: "", msg: "" });
  const [twoFactor, setTwoFactor] = useState(false);

  /* ---------------- BIM Preferences ---------------- */
  const [bim, setBim] = useState({
    defaultModel: "HQ Tower - Architectural Model",
    preferredFloor: "Floor 4 - Operations Wing",
    units: "Metric",
    viewerMode: "3D",
    highlightElements: true,
    autoSync: false,
    modelQuality: "Medium",
  });

  /* ---------------- Asset Preferences ---------------- */
  const [assetPrefs, setAssetPrefs] = useState({
    defaultView: "Table",
    sorting: "Recently Updated",
    rowsPerPage: "25",
    showImages: true,
    autoRefresh: false,
  });

  /* ---------------- Privacy ---------------- */
  const [privacy, setPrivacy] = useState({
    usageData: true,
    crashReports: true,
    rememberLogin: true,
    location: false,
    cookies: true,
  });

  /* ---------------- Danger Zone ---------------- */
  const [confirmDialog, setConfirmDialog] = useState(null);

  /* ---------------- Save state ---------------- */
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Avatar upload handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPasswordFeedback({ type: "error", msg: "Please fill out all password fields." });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordFeedback({ type: "error", msg: "New password and confirmation do not match." });
      return;
    }
    if (passwords.next.length < 6) {
      setPasswordFeedback({ type: "error", msg: "Password must be at least 6 characters long." });
      return;
    }

    setPasswordFeedback({ type: "success", msg: "Password updated successfully!" });
    setPasswords({ current: "", next: "", confirm: "" });
    setTimeout(() => setPasswordFeedback({ type: "", msg: "" }), 3000);
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    localStorage.setItem("user_profile", JSON.stringify(profile));
    localStorage.setItem("app_preferences", JSON.stringify({ preferences, theme, density, sidebarMode, notifications, bim, assetPrefs, privacy }));

    setTimeout(() => {
      setIsSaving(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    }, 600);
  };

  const handleResetChanges = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem("user_profile");
    localStorage.removeItem("app_preferences");
    window.location.reload();
  };

  const handleDangerAction = (key) => {
    if (key === "cache") {
      localStorage.clear();
      alert("Local cache cleared successfully.");
      window.location.reload();
    } else if (key === "signout") {
      localStorage.clear();
      navigate("/");
    } else if (key === "reset") {
      handleResetChanges();
    } else if (key === "delete") {
      localStorage.clear();
      navigate("/signup");
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-gray-200 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4" /> Settings saved
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage your account, BIM preferences, notifications, and security from one place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            <nav className="hidden lg:block">
              <ul className="sticky top-24 space-y-1">
                {SETTINGS_NAV.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 text-left ${
                        id === "danger"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-6">
              {/* 1. Profile Information */}
              <SettingsCard
                id="profile"
                icon={FiUser}
                title="Profile Information"
                description="Your personal and organizational details"
              >
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <div className="flex flex-col items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="relative w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-semibold overflow-hidden">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        profile.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      )}
                      <button
                        type="button"
                        aria-label="Change profile picture"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors duration-150"
                      >
                        <FiCamera className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name">
                      <TextInput
                        value={profile.fullName}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      />
                    </Field>
                    <Field label="Email Address">
                      <TextInput
                        type="email"
                        value={profile.email}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </Field>
                    <Field label="Employee ID">
                      <TextInput value={profile.employeeId} disabled />
                    </Field>
                    <Field label="Company Name">
                      <TextInput
                        value={profile.company}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      />
                    </Field>
                    <Field label="Department">
                      <TextInput
                        value={profile.department}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      />
                    </Field>
                    <Field label="Job Title">
                      <TextInput
                        value={profile.jobTitle}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      />
                    </Field>
                    <Field label="Assigned Role" className="sm:col-span-2">
                      <Select
                        value={profile.role}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      >
                        <option>Administrator</option>
                        <option>Facility Manager</option>
                        <option>Maintenance Technician</option>
                      </Select>
                    </Field>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <FiEdit2 className="w-4 h-4" /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          handleSaveAll();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-150"
                      >
                        <FiSave className="w-4 h-4" /> Save Changes
                      </button>
                    </>
                  )}
                </div>
              </SettingsCard>

              {/* 2. Account Preferences */}
              <SettingsCard
                id="preferences"
                icon={FiGlobe}
                title="Account Preferences"
                description="Localization and default landing behavior"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Preferred Language">
                    <Select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Tamil</option>
                      <option>Hindi</option>
                      <option>French</option>
                      <option>German</option>
                    </Select>
                  </Field>
                  <Field label="Time Zone">
                    <Select
                      value={preferences.timeZone}
                      onChange={(e) => setPreferences({ ...preferences, timeZone: e.target.value })}
                    >
                      <option>GMT+5:30 (Chennai, Kolkata, Mumbai)</option>
                      <option>GMT+0:00 (London)</option>
                      <option>GMT-5:00 (New York)</option>
                      <option>GMT-8:00 (Los Angeles)</option>
                      <option>GMT+9:00 (Tokyo)</option>
                    </Select>
                  </Field>
                  <Field label="Date Format">
                    <Select
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </Select>
                  </Field>
                  <Field label="Default Dashboard Landing Page">
                    <Select
                      value={preferences.landingPage}
                      onChange={(e) => setPreferences({ ...preferences, landingPage: e.target.value })}
                    >
                      <option>Dashboard Overview</option>
                      <option>Asset Management</option>
                      <option>Maintenance Schedule</option>
                      <option>Reports</option>
                      <option>BIM Viewer</option>
                    </Select>
                  </Field>
                </div>
              </SettingsCard>

              {/* 3. Appearance */}
              <SettingsCard
                id="appearance"
                icon={FiMonitor}
                title="Appearance"
                description="Customize how the platform looks and feels"
              >
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-sm font-medium text-slate-800">Theme</span>
                    <SegmentedControl
                      options={["Light", "Dark", "System Default"]}
                      value={theme}
                      onChange={setTheme}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-slate-800">Dashboard Density</span>
                    <SegmentedControl
                      options={["Comfortable", "Compact"]}
                      value={density}
                      onChange={setDensity}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-slate-800">Sidebar</span>
                    <SegmentedControl
                      options={["Expanded", "Collapsed"]}
                      value={sidebarMode}
                      onChange={setSidebarMode}
                    />
                  </div>
                </div>
              </SettingsCard>

              {/* 4. Notification Settings */}
              <SettingsCard
                id="notifications"
                icon={FiBell}
                title="Notification Settings"
                description="Choose what you want to be notified about"
              >
                <div>
                  <ToggleSwitch
                    id="notif-email"
                    label="Email Notifications"
                    description="Receive updates via email"
                    checked={notifications.email}
                    onChange={(v) => setNotifications({ ...notifications, email: v })}
                  />
                  <ToggleSwitch
                    id="notif-browser"
                    label="Browser Notifications"
                    description="Show desktop alerts while using the app"
                    checked={notifications.browser}
                    onChange={(v) => setNotifications({ ...notifications, browser: v })}
                  />
                  <ToggleSwitch
                    id="notif-maintenance"
                    label="Maintenance Alerts"
                    description="Get notified about scheduled maintenance tasks"
                    checked={notifications.maintenanceAlerts}
                    onChange={(v) => setNotifications({ ...notifications, maintenanceAlerts: v })}
                  />
                  <ToggleSwitch
                    id="notif-critical"
                    label="Critical Issue Alerts"
                    description="Immediate alerts for high-priority facility issues"
                    checked={notifications.criticalAlerts}
                    onChange={(v) => setNotifications({ ...notifications, criticalAlerts: v })}
                  />
                  <ToggleSwitch
                    id="notif-asset-status"
                    label="Asset Status Changes"
                    description="Notify when an asset's status is updated"
                    checked={notifications.assetStatusChanges}
                    onChange={(v) => setNotifications({ ...notifications, assetStatusChanges: v })}
                  />
                  <ToggleSwitch
                    id="notif-weekly"
                    label="Weekly Reports"
                    description="A summary delivered every Monday morning"
                    checked={notifications.weeklyReports}
                    onChange={(v) => setNotifications({ ...notifications, weeklyReports: v })}
                  />
                  <ToggleSwitch
                    id="notif-monthly"
                    label="Monthly Reports"
                    description="A full operational summary at month end"
                    checked={notifications.monthlyReports}
                    onChange={(v) => setNotifications({ ...notifications, monthlyReports: v })}
                  />
                </div>
              </SettingsCard>

              {/* 5. Security */}
              <SettingsCard
                id="security"
                icon={FiShield}
                title="Security"
                description="Manage your password and account protection"
              >
                {passwordFeedback.msg && (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm ${
                      passwordFeedback.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {passwordFeedback.msg}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <Field label="Current Password">
                    <TextInput
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </Field>
                  <Field label="New Password">
                    <TextInput
                      type="password"
                      value={passwords.next}
                      onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                    />
                  </Field>
                  <Field label="Confirm Password">
                    <TextInput
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="flex justify-end pb-6 border-b border-gray-100">
                  <button
                    onClick={handleUpdatePassword}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-150"
                  >
                    Update Password
                  </button>
                </div>

                <div className="pt-6">
                  <ToggleSwitch
                    id="two-factor"
                    label="Enable Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                    checked={twoFactor}
                    onChange={setTwoFactor}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                      <FiClock className="w-4 h-4" /> Last Login
                    </div>
                    <p className="text-sm font-semibold text-slate-800">Today, 9:14 AM</p>
                    <p className="text-xs text-slate-400 mt-0.5">Chennai, India</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                      <FiSmartphone className="w-4 h-4" /> Trusted Devices
                    </div>
                    <p className="text-sm font-semibold text-slate-800">2 Devices</p>
                    <p className="text-xs text-slate-400 mt-0.5">Manage trusted devices</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                      <FiWifi className="w-4 h-4" /> Current Session
                    </div>
                    <p className="text-sm font-semibold text-slate-800">Active</p>
                    <p className="text-xs text-slate-400 mt-0.5">Chrome on Windows</p>
                  </div>
                </div>
              </SettingsCard>

              {/* 6. BIM Preferences */}
              <SettingsCard
                id="bim"
                icon={FiBox}
                title="BIM Preferences"
                description="Defaults used across the BIM viewer and model workflows"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Field label="Default BIM Model">
                    <Select
                      value={bim.defaultModel}
                      onChange={(e) => setBim({ ...bim, defaultModel: e.target.value })}
                    >
                      <option>HQ Tower - Architectural Model</option>
                      <option>HQ Tower - MEP Model</option>
                      <option>Warehouse Block B - Structural Model</option>
                      <option>Campus Site - Civil Model</option>
                    </Select>
                  </Field>
                  <Field label="Preferred Floor">
                    <Select
                      value={bim.preferredFloor}
                      onChange={(e) => setBim({ ...bim, preferredFloor: e.target.value })}
                    >
                      <option>Floor 1 - Lobby & Reception</option>
                      <option>Floor 2 - Office Space</option>
                      <option>Floor 3 - Conference Center</option>
                      <option>Floor 4 - Operations Wing</option>
                      <option>Rooftop - Mechanical Plant</option>
                    </Select>
                  </Field>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-600">Measurement Units</span>
                    <SegmentedControl
                      options={["Metric", "Imperial"]}
                      value={bim.units}
                      onChange={(v) => setBim({ ...bim, units: v })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-600">Default Viewer Mode</span>
                    <SegmentedControl
                      options={["2D", "3D"]}
                      value={bim.viewerMode}
                      onChange={(v) => setBim({ ...bim, viewerMode: v })}
                    />
                  </div>
                  <Field label="Model Quality">
                    <Select
                      value={bim.modelQuality}
                      onChange={(e) => setBim({ ...bim, modelQuality: e.target.value })}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </Select>
                  </Field>
                </div>

                <ToggleSwitch
                  id="bim-highlight"
                  label="Highlight Selected Elements"
                  description="Visually emphasize elements selected in the viewer"
                  checked={bim.highlightElements}
                  onChange={(v) => setBim({ ...bim, highlightElements: v })}
                />
                <ToggleSwitch
                  id="bim-autosync"
                  label="Auto Sync BIM Data"
                  description="Automatically pull the latest model revisions"
                  checked={bim.autoSync}
                  onChange={(v) => setBim({ ...bim, autoSync: v })}
                />
              </SettingsCard>

              {/* 7. Asset Preferences */}
              <SettingsCard
                id="assets"
                icon={FiGrid}
                title="Asset Preferences"
                description="Control how asset data is displayed by default"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-600">Default Asset View</span>
                    <SegmentedControl
                      options={["Table", "Cards"]}
                      value={assetPrefs.defaultView}
                      onChange={(v) => setAssetPrefs({ ...assetPrefs, defaultView: v })}
                    />
                  </div>
                  <Field label="Default Asset Sorting">
                    <Select
                      value={assetPrefs.sorting}
                      onChange={(e) => setAssetPrefs({ ...assetPrefs, sorting: e.target.value })}
                    >
                      <option>Name</option>
                      <option>Status</option>
                      <option>Type</option>
                      <option>Recently Updated</option>
                    </Select>
                  </Field>
                  <Field label="Rows Per Page">
                    <Select
                      value={assetPrefs.rowsPerPage}
                      onChange={(e) => setAssetPrefs({ ...assetPrefs, rowsPerPage: e.target.value })}
                    >
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </Select>
                  </Field>
                </div>

                <div className="mt-4">
                  <ToggleSwitch
                    id="asset-images"
                    label="Show Asset Images"
                    description="Display thumbnail images in asset lists"
                    checked={assetPrefs.showImages}
                    onChange={(v) => setAssetPrefs({ ...assetPrefs, showImages: v })}
                  />
                  <ToggleSwitch
                    id="asset-refresh"
                    label="Auto Refresh Assets"
                    description="Automatically refresh asset data every few minutes"
                    checked={assetPrefs.autoRefresh}
                    onChange={(v) => setAssetPrefs({ ...assetPrefs, autoRefresh: v })}
                  />
                </div>
              </SettingsCard>

              {/* 8. Privacy */}
              <SettingsCard
                id="privacy"
                icon={FiLock}
                title="Privacy"
                description="Control what data is shared and stored"
              >
                <div>
                  <ToggleSwitch
                    id="privacy-usage"
                    label="Share Anonymous Usage Data"
                    description="Help improve the platform with anonymized analytics"
                    checked={privacy.usageData}
                    onChange={(v) => setPrivacy({ ...privacy, usageData: v })}
                  />
                  <ToggleSwitch
                    id="privacy-crash"
                    label="Allow Crash Reports"
                    description="Automatically send crash diagnostics"
                    checked={privacy.crashReports}
                    onChange={(v) => setPrivacy({ ...privacy, crashReports: v })}
                  />
                  <ToggleSwitch
                    id="privacy-remember"
                    label="Remember Login"
                    description="Stay signed in on this device"
                    checked={privacy.rememberLogin}
                    onChange={(v) => setPrivacy({ ...privacy, rememberLogin: v })}
                  />
                  <ToggleSwitch
                    id="privacy-location"
                    label="Location Access"
                    description="Used to tag on-site maintenance activity"
                    checked={privacy.location}
                    onChange={(v) => setPrivacy({ ...privacy, location: v })}
                  />
                  <ToggleSwitch
                    id="privacy-cookies"
                    label="Cookies Preferences"
                    description="Allow non-essential cookies for personalization"
                    checked={privacy.cookies}
                    onChange={(v) => setPrivacy({ ...privacy, cookies: v })}
                  />
                </div>
              </SettingsCard>

              {/* 9. System Information */}
              <SettingsCard
                id="system"
                icon={FiInfo}
                title="System Information"
                description="Current environment and connection status"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-slate-500 mb-1">Application Version</p>
                    <p className="text-sm font-semibold text-slate-800">v2.4.1</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <FiDatabase className="w-3.5 h-3.5" /> Database Status
                    </p>
                    <StatusPill status="Connected" />
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <FiServer className="w-3.5 h-3.5" /> Backend Status
                    </p>
                    <StatusPill status="Online" />
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <FiWifi className="w-3.5 h-3.5" /> API Status
                    </p>
                    <StatusPill status="Operational" />
                  </div>
                </div>
              </SettingsCard>

              {/* 10. Danger Zone */}
              <SettingsCard
                id="danger"
                icon={FiAlertTriangle}
                title="Danger Zone"
                description="These actions are irreversible. Proceed with caution."
              >
                <div className="rounded-xl border border-red-200 bg-red-50/50 divide-y divide-red-100">
                  {[
                    {
                      key: "cache",
                      label: "Clear Local Cache",
                      desc: "Remove locally cached assets, models, and preferences",
                      icon: FiRefreshCw,
                      action: "Clear Cache",
                    },
                    {
                      key: "signout",
                      label: "Sign Out From All Devices",
                      desc: "End every active session across all devices",
                      icon: FiLogOut,
                      action: "Sign Out All",
                    },
                    {
                      key: "reset",
                      label: "Reset Preferences",
                      desc: "Restore all settings on this page to their defaults",
                      icon: FiRotateCcw,
                      action: "Reset",
                    },
                    {
                      key: "delete",
                      label: "Delete Account",
                      desc: "Permanently delete your account and all associated data",
                      icon: FiTrash2,
                      action: "Delete Account",
                    },
                  ].map(({ key, label, desc, icon: Icon, action }) => (
                    <div key={key} className="flex items-center justify-between gap-4 p-4">
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setConfirmDialog({
                            key,
                            title: label,
                            message: `Are you sure you want to ${label.toLowerCase()}? This action cannot be undone.`,
                            confirmLabel: action,
                          })
                        }
                        className="shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-lg border border-red-300 text-red-600 hover:bg-red-100 transition-colors duration-150"
                      >
                        {action}
                      </button>
                    </div>
                  ))}
                </div>
              </SettingsCard>
            </div>
          </div>

          <div className="sticky bottom-4 mt-8 flex justify-end gap-3 bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-lg px-5 py-4 max-w-7xl mx-auto">
            <button
              onClick={handleResetChanges}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <FiRotateCcw className="w-4 h-4" /> Reset Changes
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-70 transition-colors duration-150"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" /> Save Settings
                </>
              )}
            </button>
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmLabel={confirmDialog?.confirmLabel}
        onConfirm={() => {
          handleDangerAction(confirmDialog.key);
          setConfirmDialog(null);
        }}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
};

export default Settings;