import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Admin = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <Layout>
      <div className={`relative min-h-full py-10 px-8 overflow-hidden transition-all duration-700 ${
        isLight
          ? "bg-gradient-to-br from-rose-200 via-fuchsia-100 to-purple-100"
          : "bg-gradient-to-br from-black via-purple-900 to-pink-900"
      }`}>

        {/* Animated blobs — light mode */}
        {isLight && (
          <>
            <motion.div
              animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-96 h-96 bg-pink-300/40 rounded-full blur-[80px] -z-10 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/40 rounded-full blur-[80px] -z-10 pointer-events-none"
            />
          </>
        )}

        {/* Dark mode blobs */}
        {!isLight && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-800/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
          </>
        )}

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-bold mb-6 transition-colors duration-300 ${
            isLight ? "text-purple-700" : "text-white"
          }`}
        >
          {isLight ? "🌸" : "👑"} Admin Panel
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`p-6 rounded-2xl backdrop-blur-lg transition-all duration-500 ${
            isLight
              ? "bg-white/60 border border-pink-200 shadow-lg shadow-pink-100 text-purple-800"
              : "bg-white/10 border border-white/10 text-white"
          }`}
        >
          <Link
            to="/admin-requests"
            className={`block p-3 rounded-xl transition-all duration-300 ${
              isLight
                ? "text-fuchsia-700 hover:bg-pink-200/60 hover:text-purple-800"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            📝 Requests
          </Link>
        </motion.div>

      </div>
    </Layout>
  );
};

export default Admin;