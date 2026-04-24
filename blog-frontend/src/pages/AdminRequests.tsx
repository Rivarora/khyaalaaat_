import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import Layout from "../components/Layout";
import { getUserRole } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import GlowingParticles from "../components/GlowingParticles";

type RequestItem = {
  id: number;
  title: string;
  mood: string;
  theme: string;
  status: "pending" | "completed";
  reply_text: string | null;
  username: string;
  email: string;
};

export default function AdminRequests() {
  const role = getUserRole();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [data, setData] = useState<RequestItem[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});

  if (role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    api.get("/admin/poems").then((res) => setData(res.data.requests || []));
  }, []);

  const respond = async (id: number) => {
    const replyText = replyDrafts[id];
    if (!replyText?.trim()) return;

    try {
      await api.put(`/admin/poems/${id}/reply`, { replyText });
      setData((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "completed", reply_text: replyText }
            : r
        )
      );
      setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
      toast.success("Reply saved");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save reply");
    }
  };

  const removeReply = async (id: number) => {
    try {
      await api.delete(`/admin/poems/${id}/reply`);
      setData((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "pending", reply_text: null } : r
        )
      );
      toast.success("Reply removed");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove reply");
    }
  };

  return (
    <Layout>
      <div className={`relative min-h-full py-10 px-4 overflow-hidden transition-all duration-700 ${
        isLight ? "bg-white/35 backdrop-blur-[1px]" : "bg-black/20"
      }`}>

        <GlowingParticles />

        {isLight && (
          <>
            <motion.div animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-300/50 rounded-full blur-[80px] -z-10 pointer-events-none" />
            <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -25, 0], y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-20 right-0 w-[450px] h-[450px] bg-purple-300/50 rounded-full blur-[80px] -z-10 pointer-events-none" />
            <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 15, 0], y: [0, 25, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-200/50 rounded-full blur-[80px] -z-10 pointer-events-none" />
            <motion.div animate={{ scale: [1, 1.25, 1], x: [0, -10, 0], y: [0, -20, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-fuchsia-200/50 rounded-full blur-[80px] -z-10 pointer-events-none" />
            {["top-10 left-20", "top-32 right-40", "bottom-20 left-32", "bottom-40 right-20", "top-1/2 left-10"].map((pos, i) => (
              <motion.div key={i} animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear" }} className={`absolute ${pos} text-3xl opacity-30 pointer-events-none select-none -z-10`}>🌸</motion.div>
            ))}
          </>
        )}
        {!isLight && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-800/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
          </>
        )}

        <div className="max-w-5xl mx-auto space-y-4">
        <h1 className={`text-4xl font-serif ${isLight ? "text-purple-700 drop-shadow-sm" : "text-yellow-400"}`}>All Poem Requests</h1>
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
              By: {r.username} ({r.email})
            </p>
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

            {r.reply_text && (
              <div className={`mt-2 p-3 rounded border ${
                isLight ? "bg-pink-50/80 border-pink-100" : "bg-black/40 border-white/10"
              }`}>
                <p className="font-medium">Current Reply</p>
                <p className="whitespace-pre-line">{r.reply_text}</p>
              </div>
            )}

            <textarea
              placeholder="Write poem..."
              value={replyDrafts[r.id] || ""}
              onChange={(e) =>
                setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))
              }
              className={`w-full mt-3 p-3 rounded border ${
                isLight
                  ? "bg-white border-pink-200 text-gray-800 placeholder-pink-300"
                  : "bg-black/40 border-white/10 text-white"
              }`}
            />
            <button
              onClick={() => respond(r.id)}
              className={`mt-2 px-4 py-2 rounded text-white ${
                isLight
                  ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700"
              }`}
            >
              {r.status === "completed" ? "Update Reply" : "Send Reply"}
            </button>
            {r.reply_text && (
              <button
                onClick={() => removeReply(r.id)}
                className="mt-2 ml-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Reply
              </button>
            )}
            <Link
              to={`/admin-requests/${r.id}/reply`}
              className={`inline-block mt-2 ml-3 px-4 py-2 rounded ${
                isLight
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Open Reply Page
            </Link>
          </div>
        ))}
        </div>
      </div>
    </Layout>
  );
}