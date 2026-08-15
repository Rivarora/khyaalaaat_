import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import { getDecodedToken, getUserRole } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const assetsBaseUrl = import.meta.env.VITE_ASSETS_BASE_URL || "http://localhost:3000";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: Props) => {
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
    <>
      {/* backdrop for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => onClose?.()}
          aria-hidden
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 md:top-auto md:left-auto md:bottom-auto md:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-[85vw] max-w-[320px] md:w-72 sidebar-mobile px-4 md:px-6 py-3 md:py-4 shadow-lg md:shadow-none border-b md:border-b-0 md:border-r ${
          isLight
            ? "bg-white/70 backdrop-blur-md border-pink-200"
            : "backdrop-blur-xl bg-white/5 border-white/10"
        }`}
      >
        <div className="flex flex-col gap-3 md:gap-4 md:items-start">
          <div className="flex items-center justify-between w-full md:justify-start">
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
                  {(decoded?.username?.[0] || decoded?.email?.[0])?.toUpperCase() || "P"}
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => onClose?.()}
              className="md:hidden rounded-lg border px-2 py-1 text-lg leading-none hover:bg-black/5"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-end md:gap-3">
            <nav className="flex flex-col gap-2 md:flex-row md:gap-3 md:overflow-x-auto md:whitespace-nowrap nav-stack">
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

              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className="bg-red-600 px-5 py-2 rounded-xl hover:bg-red-700 text-white">
      Logout
    </button>
  );
}
