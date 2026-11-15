import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import StudentLayout from "./layouts/StudentLayout";
import Login from "./pages/auth/Login";
import Forbidden from "./pages/public/Forbidden";

import StudentDashboard from "./pages/student/StudentDashboard";
import WardenDashboard from "./pages/warden/WardenDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          {/* Student */}
          <Route element={<RoleRoute allowedRoles={["student"]} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student" element={<StudentDashboard />} />
            </Route>
          </Route>

          {/* Warden */}
          <Route element={<RoleRoute allowedRoles={["warden"]} />}>
            <Route path="/warden" element={<WardenDashboard />} />
          </Route>

          {/* Owner */}
          <Route element={<RoleRoute allowedRoles={["owner"]} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
          </Route>
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
