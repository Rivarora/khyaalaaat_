import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import Layout from "../components/Layout";
import { getUserRole } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

type RequestItem = {
  id: number;
  title: string;
  mood: string;
  theme: string;
  status: "pending" | "completed";
  reply_text: string | null;
  replied_at: string | null;
  created_at: string;
};

export default function MyRequests() {
  const role = getUserRole();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [data, setData] = useState<RequestItem[]>([]);

  if (role !== "user") {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    api.get("/poems/my").then((res) => setData(res.data.requests || []));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/poems/my/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Request deleted");
    } catch (error: any) {
      // fallback for older route naming
      if (error?.response?.status === 404) {
        try {
          await api.delete(`/poems/my-requests/${id}`);
          setData((prev) => prev.filter((item) => item.id !== id));
          toast.success("Request deleted");
          return;
        } catch {}
      }
      toast.error(error?.response?.data?.message || "Failed to delete request");
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
            className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-300/50 rounded-full blur-[80px] -z-10 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-20 right-0 w-[450px] h-[450px] bg-purple-300/50 rounded-full blur-[80px] -z-10 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, 15, 0], y: [0, 25, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-200/50 rounded-full blur-[80px] -z-10 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], x: [0, -10, 0], y: [0, -20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-fuchsia-200/50 rounded-full blur-[80px] -z-10 pointer-events-none"
          />
        </>
      )}

      {!isLight && (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-800/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
        </>
      )}

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className={`text-4xl font-serif ${isLight ? "text-purple-700 drop-shadow-sm" : "text-yellow-400"}`}>My Request</h2>

        {data.map((r) => (
          <div
            key={r.id}
            className={`rounded-2xl p-5 border shadow-lg ${
              isLight
                ? "bg-white/60 backdrop-blur-xl border-pink-100 shadow-xl shadow-pink-100/50 text-gray-800"
                : "bg-white/5 backdrop-blur-xl border-white/10 text-white"
            }`}
          >
            <h3 className="text-xl font-medium">{r.title}</h3>
            <p>Theme: {r.theme}</p>
            <p>
              Status:{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  r.status === "completed" ? "bg-emerald-600 text-white" : "bg-amber-500 text-black"
                }`}
              >
                {r.status}
              </span>
            </p>
            <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-300"}`}>
              Requested: {new Date(r.created_at).toLocaleString()}
            </p>

            {r.reply_text ? (
              <div className={`mt-3 p-3 rounded border ${
                isLight ? "bg-pink-50/80 border-pink-100" : "bg-black/40 border-white/10"
              }`}>
                <p className="font-medium mb-1">Admin Reply</p>
                <p className="whitespace-pre-line">{r.reply_text}</p>
                {r.replied_at && (
                  <p className={`text-xs mt-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Replied: {new Date(r.replied_at).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>No reply yet.</p>
            )}
            <button
              onClick={() => handleDelete(r.id)}
              className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
                isLight
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700"
              }`}
            >
              Delete Request
            </button>
          </div>
        ))}
      </div>
      </div>
    </Layout>
  );
}