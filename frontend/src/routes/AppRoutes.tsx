import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import CandidateScan from "../pages/CandidateScan";
import CandidateReport from "../pages/CandidateReport";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/scan" element={<CandidateScan />} />
                <Route path="/candidate/:id" element={<CandidateReport />} />
            </Routes>
        </BrowserRouter>
    );
}
