import type { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getDecodedToken } from "../utils/auth";

interface Props {
  onToggleSidebar?: () => void;
}

const Navbar: FC<Props> = ({ onToggleSidebar }) => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const decoded = getDecodedToken();
  const isLight = theme === "light";

  return (
    <header className="w-full flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 py-3 border-b md:border-b-0 md:border-l shadow-sm bg-transparent min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden flex-shrink-0 px-3 py-2 rounded-lg border hover:bg-white/5"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <h1 className="text-base sm:text-lg font-semibold text-center md:text-left truncate min-w-0">
          Khyaalaaat
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className={`px-3 py-2 rounded-md border transition-colors duration-200 ${
            isLight ? "border-pink-300 bg-pink-100 text-pink-700" : "border-gray-700 text-yellow-400"
          }`}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {isLight ? "☀️" : "🌙"}
        </button>

        {isAuthenticated ? (
          <>
            <Link to={decoded?.id ? `/profile/${decoded.id}` : "/dashboard"} className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${
                  isLight ? "bg-pink-100 text-fuchsia-700" : "bg-gray-800 text-yellow-400"
                }`}
                title={decoded?.username || decoded?.email || "Profile"}
              >
                {(decoded?.username?.[0] || decoded?.email?.[0])?.toUpperCase() || "U"}
              </div>
            </Link>

            <button
              onClick={logout}
              className="px-3 py-2 rounded-md border hover:bg-white/5"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-2 rounded-md border hover:bg-white/5">
              Login
            </Link>
            <Link to="/register" className="px-3 py-2 rounded-md border hover:bg-white/5">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
