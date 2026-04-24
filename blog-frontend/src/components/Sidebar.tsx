import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import { getDecodedToken, getUserRole } from "../utils/auth";

const assetsBaseUrl = import.meta.env.VITE_ASSETS_BASE_URL || "http://localhost:3000";

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const decoded = getDecodedToken();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const isAdmin = getUserRole() === "admin";

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!decoded?.id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/users/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfilePicture(res.data?.profile_picture || null);
      } catch {
        setProfilePicture(null);
      }
    };

    fetchProfilePicture();
    window.addEventListener("profile-updated", fetchProfilePicture);

    return () => {
      window.removeEventListener("profile-updated", fetchProfilePicture);
    };
  }, [decoded?.id]);

  return (
    <div className={`px-6 py-4 shadow-lg border-b transition-all duration-500 ${
      isLight
        ? "bg-white/70 backdrop-blur-md border-pink-200"
        : "backdrop-blur-xl bg-white/5 border-white/10"
    }`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <Link to={decoded?.id ? `/profile/${decoded.id}` : "/dashboard"} className="shrink-0">
          {profilePicture ? (
            <img
              src={`${assetsBaseUrl}${profilePicture}`}
              alt="Profile logo"
              className="h-12 w-12 rounded-full border border-yellow-500/70 object-cover shadow-md"
            />
          ) : (
            <div
              className={`h-12 w-12 rounded-full border border-yellow-500/70 shadow-md flex items-center justify-center font-semibold ${
                isLight ? "bg-pink-100 text-fuchsia-700" : "bg-gray-800 text-yellow-400"
              }`}
              title="Profile"
            >
              {decoded?.email?.[0]?.toUpperCase() || "P"}
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-wrap items-center gap-3 lg:justify-end">
          <nav className="flex flex-wrap gap-2 md:gap-3">
        <Link
          to="/dashboard"
          className={`block px-4 py-2 rounded-xl transition-all duration-300 ${
            isLight
              ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          Dashboard
        </Link>

        {!isAdmin && (
          <>
            <Link
              to="/request-poem"
              className={`block px-4 py-2 rounded-xl transition-all duration-300 ${
                isLight
                  ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              Make a Request
            </Link>

            <Link
              to="/my-requests"
              className={`block px-4 py-2 rounded-xl transition-all duration-300 ${
                isLight
                  ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              My Requests
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link
              to="/admin"
              className={`block px-4 py-2 rounded-xl transition-all duration-300 ${
                isLight
                  ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/admin-requests"
              className={`block px-4 py-2 rounded-xl transition-all duration-300 ${
                isLight
                  ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              All Requests
            </Link>
          </>
        )}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-xl border transition-colors duration-300 ${
                isLight
                  ? "border-pink-300 bg-pink-100 hover:bg-pink-200 text-pink-700"
                  : "border-gray-700 hover:bg-gray-800 text-yellow-400"
              }`}
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLight ? "☀️" : "🌙"}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="bg-red-600 px-5 py-2 rounded-xl hover:bg-red-700 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;