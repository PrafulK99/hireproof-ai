import { BrowserRouter, Routes, Route } from "react-router-dom";

import { RecruiterLogin } from "../pages/RecruiterLogin";
import { CandidateLogin } from "../pages/CandidateLogin";
import CandidateScan from "../pages/CandidateScan";
import CandidateReport from "../pages/CandidateReport";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthCallback from "../pages/AuthCallback";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<RecruiterLogin />} />

        <Route path="/recruiter-login" element={<RecruiterLogin />} />

        <Route path="/candidate-login" element={<CandidateLogin />} />

        {/* OAuth callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route
          path="/candidate-scan"
          element={
            <ProtectedRoute>
              <CandidateScan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-report"
          element={
            <ProtectedRoute>
              <CandidateReport />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
