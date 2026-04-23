import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
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
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className={`text-3xl font-bold ${isLight ? "text-fuchsia-700" : "text-yellow-300"}`}>All Poem Requests</h1>
        {data.map((r) => (
          <div
            key={r.id}
            className={`rounded-2xl p-5 border shadow-lg ${
              isLight
                ? "bg-white/70 border-pink-200 shadow-pink-100/60 text-gray-800"
                : "bg-white/10 border-white/20 text-white"
            }`}
          >
            <h3 className="text-xl font-medium">{r.title}</h3>
            <p>Mood: {r.mood}</p>
            <p>Theme: {r.theme}</p>
            <p>
              By: {r.username} ({r.email})
            </p>
            <p>
              Status:{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  r.status === "completed" ? "bg-green-600" : "bg-yellow-600"
                }`}
              >
                {r.status}
              </span>
            </p>

            {r.reply_text && (
              <div className={`mt-2 p-3 rounded border ${
                isLight ? "bg-fuchsia-50 border-fuchsia-100" : "bg-black/30 border-white/10"
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
              className="mt-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
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
              className="inline-block mt-2 ml-3 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Open Reply Page
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}