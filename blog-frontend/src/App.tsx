import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import RequestPoem from "./pages/RequestPoem";
import MyRequests from "./pages/MyRequests";
import AdminRequests from "./pages/AdminRequests";
import AdminReply from "./pages/AdminReply";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
