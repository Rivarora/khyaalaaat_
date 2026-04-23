import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getUserRole } from "../utils/auth";

const Sidebar = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const isAdmin = getUserRole() === "admin";

  return (
    <div className={`w-64 p-6 shadow-2xl border-r transition-all duration-500 ${
      isLight
        ? "bg-gradient-to-b from-pink-100 via-fuchsia-50 to-purple-100 border-pink-200"
        : "backdrop-blur-xl bg-white/5 border-white/10"
    }`}>

      <h2 className={`text-2xl font-bold mb-10 transition-colors duration-300 ${
        isLight ? "text-purple-700" : "text-white"
      }`}>
        {isLight ? "🌸" : "🚀"} MyApp
      </h2>

      <nav className="space-y-4">
        <Link
          to="/dashboard"
          className={`block p-3 rounded-xl transition-all duration-300 ${
            isLight
              ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          📊 Dashboard
        </Link>

        {!isAdmin && (
          <>
            <Link
              to="/request-poem"
              className={`block p-3 rounded-xl transition-all duration-300 ${
                isLight
                  ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              ✍️ Request Poem
            </Link>

            <Link
              to="/my-requests"
              className={`block p-3 rounded-xl transition-all duration-300 ${
                isLight
                  ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              📝 My Requests
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link
              to="/admin"
              className={`block p-3 rounded-xl transition-all duration-300 ${
                isLight
                  ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              👑 Admin Dashboard
            </Link>
            <Link
              to="/admin-requests"
              className={`block p-3 rounded-xl transition-all duration-300 ${
                isLight
                  ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              🗂️ All Requests
            </Link>
          </>
        )}
      </nav>

      {/* Light mode floral decoration */}
      {isLight && (
        <div className="absolute bottom-8 left-0 w-full text-center text-3xl opacity-20 select-none pointer-events-none">
          🌺🌸🌼
        </div>
      )}
    </div>
  );
};

export default Sidebar;