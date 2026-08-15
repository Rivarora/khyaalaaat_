import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { getUserRole } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";

const RequestPoem = () => {
  const role = getUserRole();
  const { theme: uiTheme } = useTheme();
  const isLight = uiTheme === "light";
  const [mood, setMood] = useState("");
  const [poemTheme, setPoemTheme] = useState("");

  if (role !== "user") {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async () => {
    if (!mood || !poemTheme) {
      toast.error("All fields required");
      return;
    }

    try {
      await api.post("/poems", { mood, theme: poemTheme });

      toast.success("Request submitted ✨");
      setMood("");
      setPoemTheme("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit request");
    }
  };

  return (
    <Layout>
      <div className={`relative min-h-full py-10 px-4 transition-all duration-700 ${
        isLight ? "bg-white/35 backdrop-blur-[1px]" : "bg-black/20"
      }`}>
        {isLight && (
          <>
            <motion.div
              animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-pink-300/50 rounded-full blur-[80px] -z-10 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], x: [0, -25, 0], y: [0, 20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-20 right-0 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px] bg-purple-300/50 rounded-full blur-[80px] -z-10 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], x: [0, 15, 0], y: [0, 25, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] bg-emerald-200/50 rounded-full blur-[80px] -z-10 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1], x: [0, -10, 0], y: [0, -20, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute bottom-10 right-1/4 w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] lg:w-[350px] lg:h-[350px] bg-fuchsia-200/50 rounded-full blur-[80px] -z-10 pointer-events-none"
            />
          </>
        )}

        {!isLight && (
          <>
            <div className="absolute top-0 left-0 w-52 h-52 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-800/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-52 h-52 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-pink-800/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
          </>
        )}

        <div className="flex justify-center items-center min-h-[75vh] px-2 sm:px-4">
        <div className={`w-full max-w-xl backdrop-blur-xl p-5 sm:p-8 rounded-3xl border shadow-xl ${
          isLight
            ? "bg-white/60 border-pink-100 text-gray-800 shadow-xl shadow-pink-100/50"
            : "bg-white/5 border-white/10 text-white"
        }`}>
          <h2 className={`text-3xl sm:text-4xl font-serif mb-6 text-center ${isLight ? "text-purple-700 drop-shadow-sm" : "text-yellow-400"}`}>
            ✍️ Make a Request
          </h2>

          {/* Title */}
          <input
            type="text"
            placeholder="Enter mood..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className={`w-full p-3 mb-4 rounded border ${
              isLight
                ? "bg-white border-pink-200 text-gray-800 placeholder-pink-300"
                : "bg-black/40 border-white/10 text-white"
            }`}
          />

          <textarea
            placeholder="Enter your theme (example: rain, heartbreak, friendship)"
            value={poemTheme}
            onChange={(e) => setPoemTheme(e.target.value)}
            className={`w-full p-3 mb-4 rounded h-32 border ${
              isLight
                ? "bg-white border-pink-200 text-gray-800 placeholder-pink-300"
                : "bg-black/40 border-white/10 text-white"
            }`}
          />

          {/* Button */}
          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-xl transition text-white ${
              isLight
                ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700"
            }`}
          >
            Submit Request
          </button>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default RequestPoem;