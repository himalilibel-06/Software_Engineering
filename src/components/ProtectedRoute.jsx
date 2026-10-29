import { Navigate } from "react-router-dom";
import { getAuthToken } from "../lib/api";

/**
 * Redirects to login when no JWT is stored (Phase 1: presence check only).
 */
export default function ProtectedRoute({ children }) {
  if (!getAuthToken()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
