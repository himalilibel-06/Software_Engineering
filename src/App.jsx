import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AssetManagement from "./pages/AssetManagement";
import AssetDetails from "./pages/AssetDetails";
import BIMViewer from "./pages/BIMViewer";
import MaintenanceManagement from "./pages/MaintenanceManagement";
import IssueManagement from "./pages/IssueManagement";
import UserManagement from "./pages/UserManagement";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import EditAsset from "./pages/EditAsset";
import AssetInventory from "./pages/AssetInventory";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";
import DashboardOverview from "./pages/DashboardOverview";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-overview"
        element={
          <ProtectedRoute>
            <DashboardOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedRoute>
            <AssetManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asset-details"
        element={
          <ProtectedRoute>
            <AssetDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asset-inventory"
        element={
          <ProtectedRoute>
            <AssetInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-asset"
        element={
          <ProtectedRoute>
            <EditAsset />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bim-viewer"
        element={
          <ProtectedRoute>
            <BIMViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <MaintenanceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance-schedule"
        element={
          <ProtectedRoute>
            <MaintenanceSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/issues"
        element={
          <ProtectedRoute>
            <IssueManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      {/* Fallback route to prevent blank screens */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
