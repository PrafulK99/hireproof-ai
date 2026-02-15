import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecruiterLogin } from './pages/RecruiterLogin';
import { CandidateLogin } from './pages/CandidateLogin';
import CandidateScan from "./pages/CandidateScan";
import CandidateReport from "./pages/CandidateReport";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CandidateHome from "./pages/CandidateHome";
import CandidateAnalysis from "./pages/Candidateanalysis"; // ADD THIS IMPORT
import CompareCandidates from "./pages/CompareCandidates";
import AuthGuard from "./components/AuthGuard";
import { getAuthSession } from "./lib/session";
import AuthCallback from "./pages/AuthCallback";
import Home from "./pages/Home";



// Main App with Routing
export default function App() {
  const session = getAuthSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <Navigate
              to={session?.role === "candidate" ? "/candidate/home" : "/recruiter/dashboard"}
              replace
            />
          }
        />
        <Route
          path="/recruiter/dashboard"
          element={
            <AuthGuard allowedRoles={["recruiter"]}>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/candidate/dashboard"
          element={
            <AuthGuard allowedRoles={["candidate"]}>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/candidate/home"
          element={
            <AuthGuard allowedRoles={["candidate"]}>
              <CandidateHome />
            </AuthGuard>
          }
        />
        {/* ADD THIS NEW ROUTE FOR ANALYSIS */}
        <Route
          path="/analysis"
          element={
            <AuthGuard allowedRoles={["candidate"]}>
              <CandidateAnalysis />
            </AuthGuard>
          }
        />
        <Route
          path="/scan"
          element={
            <AuthGuard allowedRoles={["recruiter"]}>
              <CandidateScan />
            </AuthGuard>
          }
        />
        <Route
          path="/candidate/:id"
          element={
            <AuthGuard allowedRoles={["recruiter", "candidate"]}>
              <CandidateReport />
            </AuthGuard>
          }
        />
        <Route
          path="/compare"
          element={
            <AuthGuard allowedRoles={["recruiter"]}>
              <CompareCandidates />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard allowedRoles={["recruiter", "candidate"]}>
              <Profile />
            </AuthGuard>
          }
        />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}