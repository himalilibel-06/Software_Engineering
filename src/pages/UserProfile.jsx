const API_URL = "https://bim-management-backend.onrender.com";
import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import {
  FiCamera,
  FiDownload,
  FiEdit2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiBox,
  FiTool,
  FiAlertCircle,
  FiFileText,
  FiUsers,
  FiClipboard,
  FiLock,
  FiKey,
  FiEye,
  FiTrendingUp,
  FiActivity,
  FiClock,
  FiBarChart2,
  FiShield,
  FiHome,
  FiGrid,
  FiSettings,
  FiX,
  FiTrash2,
} from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Reusable building blocks                                          */
/* ------------------------------------------------------------------ */

const Card = ({ title, icon: Icon, description, children, className = "" }) => (
  <section
    className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 sm:p-8 ${className}`}
  >
    {title && (
      <div className="flex items-start gap-3 mb-6">
        {Icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-700 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
    )}
    {children}
  </section>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
    <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-0.5">{value || "N/A"}</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    {Icon && (
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-700 mb-3">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <p className="text-2xl font-bold text-slate-900">{value ?? 0}</p>
    <p className="text-xs text-slate-500 mt-1">{label}</p>
  </div>
);

const SkillChip = ({ label }) => (
  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
    {label}
  </span>
);

const ProgressBar = ({ value, label, sublabel }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{sublabel ?? `${value || 0}%`}</span>
    </div>
    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-blue-700 transition-all duration-500 ease-out"
        style={{ width: `${value || 0}%` }}
      />
    </div>
  </div>
);

const ProjectStatusPill = ({ status }) => {
  const map = {
    Active: "bg-green-50 text-green-700",
    "On Hold": "bg-amber-50 text-amber-700",
    Completed: "bg-blue-50 text-blue-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || map.Active}`}>
      {status || "Active"}
    </span>
  );
};

const PermissionRow = ({ label, allowed }) => (
  <div className="flex items-center gap-2.5 py-2">
    {allowed ? (
      <FiCheckCircle className="w-4 h-4 text-green-600 shrink-0" />
    ) : (
      <FiXCircle className="w-4 h-4 text-gray-300 shrink-0" />
    )}
    <span className={`text-sm ${allowed ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

const UserProfile = () => {
  const { id: routeUserId } = useParams(); // Reads user ID from URL parameters (e.g. /profile/:id)
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Interaction states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const fileInputRef = useRef(null);
  const photoMenuRef = useRef(null);

  // Helper to resolve current target User ID (from URL param or LocalStorage)
  const getTargetUserId = () => {
    if (routeUserId) return routeUserId;
    const rawData = localStorage.getItem('user');
    if (rawData) {
      const userData = JSON.parse(rawData);
      return userData._id || userData.id;
    }
    return null;
  };

  // Helper function to append and persist a new activity item to MongoDB
  const logActivity = async (text, iconType = "box") => {
    const userId = getTargetUserId();
    if (!userId) return;

    const newItem = { text, time: "Just now", iconType };
    const updatedActivities = [newItem, ...recentActivity];
    setRecentActivity(updatedActivities);

    try {
      await apiFetch(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ recentActivity: updatedActivities }),
      });
    } catch (err) {
      console.error("Failed to persist activity:", err);
    }
  };

  useEffect(() => {
    const userId = getTargetUserId();

    if (userId) {
      setLoading(true);
      apiFetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setEditFormData(data);
          
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          } else {
            setProfileImage(null);
          }

          if (data.recentActivity && Array.isArray(data.recentActivity)) {
            setRecentActivity(data.recentActivity);
          } else {
            setRecentActivity([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [routeUserId]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (photoMenuRef.current && !photoMenuRef.current.contains(event.target)) {
        setShowPhotoMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case "tool": return FiTool;
      case "alert": return FiAlertCircle;
      case "file": return FiFileText;
      case "box":
      default:
        return FiBox;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);

        const updatedData = { ...profile, profileImage: base64Image };
        setProfile(updatedData);

        try {
          const userId = getTargetUserId();
          if (!userId) return;

          await fetch(`${API_URL}/api/users/${userId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ profileImage: base64Image }),
});

          await logActivity("Updated profile picture", "file");
        } catch (error) {
          console.error("Failed to save profile image:", error);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowPhotoMenu(false);
  };

  const handleRemovePhoto = async () => {
    setProfileImage(null);
    setShowPhotoMenu(false);

    try {
      const userId = getTargetUserId();
      if (!userId) return;

      await fetch(`${API_URL}/api/users/${userId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    profileImage: "",
  }),
});

      await logActivity("Removed profile picture", "alert");
    } catch (error) {
      console.error("Failed to remove profile image:", error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!profile) return;
    const content = `
      USER PROFILE REPORT
      ====================
      Full Name: ${profile.fullName || "N/A"}
      Email Address: ${profile.email || "N/A"}
      Phone Number: ${profile.phone || "N/A"}
      Employee ID: ${profile.employeeId || "N/A"}
      Department: ${profile.department || "N/A"}
      Office Location: ${profile.officeLocation || "N/A"}
      Company: ${profile.company || "N/A"}
      Date Joined: ${profile.dateJoined || "N/A"}
    `;

    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `${profile.fullName || "user"}_profile.pdf`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    await logActivity("Downloaded profile PDF report", "file");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const userId = getTargetUserId();
      if (!userId) return;

      const response = await fetch(
  `${API_URL}/api/users/${userId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editFormData),
  }
);

      if (!response.ok) {
        throw new Error("Failed to update profile in database");
      }

      const updatedUser = await response.json();
      setProfile(updatedUser);
      setIsEditing(false);

      await logActivity("Updated profile details", "box");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save changes to database.");
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-600">Loading profile data...</div>;
  if (!profile) return <div className="p-10 text-center text-slate-600">User profile not found.</div>;

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "professional", label: "Professional" },
    { id: "projects", label: "Projects" },
    { id: "performance", label: "Performance" },
    { id: "permissions", label: "Permissions" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* ---------------- Sidebar ---------------- */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-slate-900 text-slate-300">
        <div className="h-16 flex items-center px-6 font-bold text-white text-base tracking-wide border-b border-slate-800">
          Smart BIM FM
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1 text-sm font-medium">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FiHome className="w-4 h-4 text-slate-400" /> Dashboard
          </Link>
          <Link
            to="/assets"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FiGrid className="w-4 h-4 text-slate-400" /> Asset
          </Link>
          <Link
            to="/maintenance"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FiTool className="w-4 h-4 text-slate-400" /> Maintenance
          </Link>
          <Link
            to="/issues"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FiAlertCircle className="w-4 h-4 text-slate-400" /> Issue
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600 text-white font-semibold transition"
          >
            <FiUsers className="w-4 h-4 text-white" /> Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FiSettings className="w-4 h-4 text-slate-400" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          Role: <span className="text-slate-400 font-medium">{profile?.role || "User"}</span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* ---------------- Header ---------------- */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-gray-200 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-slate-900">User Profile</h1>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* ---------------- Hero Section ---------------- */}
          <Card className="!p-6 sm:!p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-semibold shrink-0 shadow-md overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{profile?.fullName || "User"}</h2>
                  <p className="text-sm font-medium text-slate-600 mt-0.5">{profile?.jobTitle || profile?.role || "Role / Job Title"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition"
                >
                  <FiEdit2 className="w-4 h-4" /> Edit Profile
                </button>
                
                <div className="relative" ref={photoMenuRef}>
                  <button 
                    onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                  >
                    <FiCamera className="w-4 h-4" /> Change Photo
                  </button>

                  {showPhotoMenu && (
                    <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 w-48 z-40 text-left">
                      <button
                        onClick={() => { setShowPhotoMenu(false); fileInputRef.current?.click(); }}
                        className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition"
                      >
                        <FiCamera className="w-4 h-4 text-blue-600" /> Choose from browser
                      </button>
                      <button
                        onClick={handleRemovePhoto}
                        className="w-full px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition border-t border-gray-100"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-500" /> Remove photo
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  <FiDownload className="w-4 h-4" /> Download Profile
                </button>
              </div>
            </div>
          </Card>

          {/* ---------------- Dynamic Account Statistics ---------------- */}
          {profile?.stats && profile.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {profile.stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </div>
          )}

          {/* ---------------- Tabs ---------------- */}
          <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150 ${
                  activeTab === tab.id
                    ? "border-blue-700 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ---------------- Overview Tab ---------------- */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="Personal Information" icon={FiBriefcase} className="lg:col-span-1">
                <InfoRow icon={FiBriefcase} label="Full Name" value={profile.fullName} />
                <InfoRow icon={FiMail} label="Email Address" value={profile.email} />
                <InfoRow icon={FiPhone} label="Phone Number" value={profile.phone} />
                <InfoRow icon={FiKey} label="Employee ID" value={profile.employeeId} />
                <InfoRow icon={FiUsers} label="Department" value={profile.department} />
                <InfoRow icon={FiMapPin} label="Office Location" value={profile.officeLocation} />
                <InfoRow icon={FiBriefcase} label="Company" value={profile.company} />
                <InfoRow icon={FiCalendar} label="Date Joined" value={profile.dateJoined} />
              </Card>

              <Card title="Contact Information" icon={FiMail} className="lg:col-span-1">
                <InfoRow icon={FiMail} label="Work Email" value={profile.email} />
                <InfoRow icon={FiPhone} label="Office Phone" value={profile.officePhone} />
                <InfoRow icon={FiPhone} label="Mobile" value={profile.phone} />
                <InfoRow icon={FiMapPin} label="Office Address" value={profile.officeLocation} />
                <InfoRow icon={FiUsers} label="Emergency Contact" value={profile.emergencyContact} />
              </Card>

              {/* Persisted Activity Feed */}
              <Card title="Recent Activity" icon={FiActivity} className="lg:col-span-1">
                {recentActivity.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    No recent activity found.
                  </div>
                ) : (
                  <ol className="relative space-y-5 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-gray-200">
                    {recentActivity.map((item, idx) => {
                      const Icon = getActivityIcon(item.iconType);
                      return (
                        <li key={idx} className="relative pl-7">
                          <span className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-700 ring-4 ring-blue-50" />
                          <div className="flex items-start gap-2">
                            <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm text-slate-800 leading-snug">{item.text}</p>
                              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                <FiClock className="w-3 h-3" /> {item.time}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </Card>
            </div>
          )}

          {/* ---------------- Professional Tab ---------------- */}
          {activeTab === "professional" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Professional Information" icon={FiAward}>
                <InfoRow icon={FiShield} label="Role" value={profile.role} />
                <InfoRow icon={FiClock} label="Experience" value={profile.experience} />
                <InfoRow icon={FiTool} label="Specialization" value={profile.specialization} />
                <div className="pt-4">
                  <p className="text-xs text-slate-500 mb-2.5">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, idx) => <SkillChip key={idx} label={skill} />)
                    ) : (
                      <p className="text-xs text-slate-400">No skills specified.</p>
                    )}
                  </div>
                </div>
              </Card>

              <Card title="Certifications" icon={FiAward}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile?.certifications && profile.certifications.length > 0 ? (
                    profile.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all duration-150"
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-700 mb-3">
                          <FiAward className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{cert.name}</p>
                        <p className="text-xs text-slate-500 mt-2">Issued: {cert.issued || "N/A"}</p>
                        <p className="text-xs text-slate-500">Expires: {cert.expires || "N/A"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 col-span-2">No certifications recorded.</p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* ---------------- Projects Tab ---------------- */}
          {activeTab === "projects" && (
            <Card title="Assigned Projects" icon={FiClipboard} description="Projects assigned to this user">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile?.projects && profile.projects.length > 0 ? (
                  profile.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-150"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{project.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{project.building}</p>
                        </div>
                        <ProjectStatusPill status={project.status} />
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                        Role: <span className="text-slate-700 font-medium">{project.role || "N/A"}</span>
                      </p>
                      <ProgressBar value={project.progress} label="Progress" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No projects currently assigned.</p>
                )}
              </div>
            </Card>
          )}

          {/* ---------------- Performance Tab ---------------- */}
          {activeTab === "performance" && (
            <Card title="Performance Dashboard" icon={FiBarChart2} description="Performance summary metrics">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                {profile?.performance && profile.performance.length > 0 ? (
                  profile.performance.map((item, idx) => (
                    <ProgressBar key={idx} {...item} />
                  ))
                ) : (
                  <p className="text-sm text-slate-400 col-span-2">No performance metrics recorded.</p>
                )}
              </div>
            </Card>
          )}

          {/* ---------------- Permissions Tab ---------------- */}
          {activeTab === "permissions" && (
            <Card
              title="Role Permissions"
              icon={FiLock}
              description={`Access granted based on assigned permissions`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                {profile?.permissions && profile.permissions.length > 0 ? (
                  profile.permissions.map((perm, idx) => (
                    <PermissionRow key={idx} {...perm} />
                  ))
                ) : (
                  <p className="text-sm text-slate-400 col-span-2">No permissions explicitly assigned.</p>
                )}
              </div>
            </Card>
          )}

        </main>
      </div>

      {/* ---------------- Edit Profile Modal Popup ---------------- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-slate-900">Edit Profile</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFormData.fullName || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editFormData.email || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number / Mobile</label>
                <input
                  type="text"
                  value={editFormData.phone || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={editFormData.employeeId || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, employeeId: e.target.value })}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
                <input
                  type="text"
                  value={editFormData.department || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Office Location / Address</label>
                <input
                  type="text"
                  value={editFormData.officeLocation || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, officeLocation: e.target.value })}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Company</label>
                <input
                  type="text"
                  value={editFormData.company || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date Joined</label>
                <input
                  type="text"
                  value={editFormData.dateJoined || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, dateJoined: e.target.value })}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;