import { useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { getUserRole } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";

const RequestPoem = () => {
  const role = getUserRole();
  const { theme: uiTheme } = useTheme();
  const isLight = uiTheme === "light";
  const [title, setTitle] = useState("");
  const [poemTheme, setPoemTheme] = useState("");

  if (role !== "user") {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async () => {
    if (!title || !poemTheme) {
      toast.error("All fields required");
      return;
    }

    try {
      await api.post("/poems", { title, theme: poemTheme });

      toast.success("Request submitted ✨");
      setTitle("");
      setPoemTheme("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit request");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <div className={`w-full max-w-xl backdrop-blur-xl p-8 rounded-3xl border shadow-xl ${
          isLight
            ? "bg-white/70 border-pink-200 text-gray-800 shadow-pink-200/60"
            : "bg-white/10 border-white/10 text-white"
        }`}>
          <h2 className={`text-3xl font-serif mb-6 text-center ${isLight ? "text-fuchsia-700" : "text-yellow-400"}`}>
            ✍️ Request a Poem
          </h2>

          {/* Title */}
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 mb-4 rounded border ${
              isLight
                ? "bg-white border-pink-200 text-gray-800 placeholder-pink-300"
                : "bg-gray-800 border-gray-700 text-white"
            }`}
          />

          <textarea
            placeholder="Enter your theme (example: rain, heartbreak, friendship)"
            value={poemTheme}
            onChange={(e) => setPoemTheme(e.target.value)}
            className={`w-full p-3 mb-4 rounded h-32 border ${
              isLight
                ? "bg-white border-pink-200 text-gray-800 placeholder-pink-300"
                : "bg-gray-800 border-gray-700 text-white"
            }`}
          />

          {/* Button */}
          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-xl transition text-white ${
              isLight
                ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Submit Request
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default RequestPoem;