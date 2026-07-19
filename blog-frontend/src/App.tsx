import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import RequestPoem from "./pages/RequestPoem";
import MyRequests from "./pages/MyRequests";
import AdminRequests from "./pages/AdminRequests";
import AdminReply from "./pages/AdminReply";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* Guest-only routes — logged-in users get redirected away */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-poem"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <RequestPoem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyRequests />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-requests/:id/reply"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReply />
            </ProtectedRoute>
          }
        />

      </Routes>
    </HashRouter>
  );
}

export default App;