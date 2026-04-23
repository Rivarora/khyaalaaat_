import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      className={`h-16 border-b flex items-center justify-between px-8 transition-colors duration-300 ${
        isLight
          ? "bg-pink-50 border-pink-200 text-gray-800"
          : "bg-gray-900 border-gray-800 text-white"
      }`}
    >
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">

        <button
          onClick={toggleTheme}
          className={`px-3 py-2 rounded-lg border transition-colors duration-300 ${
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
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 text-white"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;