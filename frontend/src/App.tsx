import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CandidateScan from "./pages/CandidateScan";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/scan" replace />} />
        <Route path="/scan" element={<CandidateScan />} />
        <Route path="/candidate/:id" element={<PlaceholderReport />} />
      </Routes>
    </BrowserRouter>
  );
}

// Placeholder until the full report page is built
function PlaceholderReport() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white">
      <p className="text-xl">Candidate Report (coming soon)</p>
    </div>
  );
}
