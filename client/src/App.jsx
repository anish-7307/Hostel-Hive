
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Layouts
import StudentLayout from "./layouts/StudentLayout";

// Authentication Pages
import Login from "./pages/auth/Login";

// Public Pages
import Forbidden from "./pages/public/Forbidden";
import LandingPage from "./pages/public/LandingPage";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentFeaturePage from "./pages/student/StudentFeaturePage";

// Warden Pages
import WardenDashboard from "./pages/warden/WardenDashboard";
import WardenLayout from "./layouts/WardenLayout";
import WardenStudents from "./pages/warden/WardenStudents";
import WardenLeaveRequests from "./pages/warden/WardenLeaveRequests";
import WardenComplaints from "./pages/warden/WardenComplaints";
import WardenAttendance from "./pages/warden/WardenAttendance";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";

// Route Protection
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import AuthPlaceholder from "./pages/auth/AuthPlaceholder";
import { useAuth } from "./context/useAuth";

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <Navigate to={`/${user.role}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/register" element={<AuthPlaceholder />} />
        <Route path="/forgot-password" element={<AuthPlaceholder />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          {/* Student Routes */}
          <Route element={<RoleRoute allowedRoles={["student"]} />}>
            <Route element={<StudentLayout />}>

              <Route
                path="/student"
                element={<StudentDashboard />}
              />

              <Route
                path="/student/room"
                element={<StudentFeaturePage />}
              />

              <Route
                path="/student/attendance"
                element={<StudentFeaturePage />}
              />

              <Route
                path="/student/fees"
                element={<StudentFeaturePage />}
              />

              <Route
                path="/student/leave"
                element={<StudentFeaturePage />}
              />

              <Route
                path="/student/visitors"
                element={<StudentFeaturePage />}
              />

              <Route
                path="/student/complaints"
                element={<StudentFeaturePage />}
              />

              <Route
                path="/student/notifications"
                element={<StudentFeaturePage />}
              />

            </Route>
          </Route>

          {/* Warden Routes */}
          <Route element={<RoleRoute allowedRoles={["warden"]} />}>
            <Route path="/warden" element={<WardenLayout />}>
              <Route index element={<WardenDashboard />} />
              <Route path="students" element={<WardenStudents />} />
              <Route path="attendance" element={<WardenAttendance />} />
              <Route path="leave-requests" element={<WardenLeaveRequests />} />
              <Route path="complaints" element={<WardenComplaints />} />
            </Route>
          </Route>

          {/* Owner Routes */}
          <Route element={<RoleRoute allowedRoles={["owner"]} />}>
            <Route
              path="/owner"
              element={<OwnerDashboard />}
            />
          </Route>

        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={<HomeRedirect />}
        />

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
