import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MaternalRisk from "./pages/MaternalRisk.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import TutorialPage from "./pages/TutorialPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";


// Check if user is authenticated using JWT stored in localStorage
const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MaternalRisk />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/patients"
          element={isAuthenticated() ? <PatientsPage /> : <Navigate to="/auth" />}
        />
        {/* <Route
          path="/reports"
          element={isAuthenticated() ? <ReportsPage /> : <Navigate to="/auth" />}
        /> */}

        {/* Catch-all: redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
