import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
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
};

export default function AdminReply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = getUserRole();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!id) return;

    api.get(`/admin/poems/${id}`).then((res) => {
      setRequest(res.data.request);
      setReplyText(res.data.request?.reply_text || "");
    });
  }, [id]);

  if (role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const onSubmit = async () => {
    if (!id || !replyText.trim()) return;
    try {
      await api.put(`/admin/poems/${id}/reply`, { replyText });
      toast.success("Reply saved");
      navigate("/admin-requests");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save reply");
    }
  };

  const onDeleteReply = async () => {
    if (!id) return;
    try {
      await api.delete(`/admin/poems/${id}/reply`);
      toast.success("Reply deleted");
      setReplyText("");
      setRequest((prev) => (prev ? { ...prev, status: "pending", reply_text: null } : prev));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete reply");
    }
  };

  return (
    <Layout>
      <div className={`relative min-h-full py-10 px-4 transition-all duration-700 ${
        isLight ? "bg-white/35 backdrop-blur-[1px]" : "bg-black/20"
      }`}>
        <div className="max-w-4xl mx-auto space-y-4">
        <h1 className={`text-3xl font-bold ${isLight ? "text-fuchsia-700" : "text-yellow-300"}`}>Reply to Request</h1>

        {request && (
          <div className={`rounded-2xl p-5 border ${
            isLight ? "bg-white/70 border-pink-200 text-gray-800" : "bg-white/10 border-white/20 text-white"
          }`}>
            <h2 className="text-xl font-medium">{request.title}</h2>
            <p>Theme: {request.theme}</p>
            <p>Status: {request.status}</p>
          </div>
        )}

        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write poem response..."
          className={`w-full min-h-56 p-4 rounded border ${
            isLight ? "bg-white border-pink-200 text-gray-800 placeholder-pink-300" : "bg-black/40 border-white/10 text-white"
          }`}
        />

        <button
          onClick={onSubmit}
          className="px-5 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          Save Reply
        </button>
        {request?.reply_text && (
          <button
            onClick={onDeleteReply}
            className="ml-3 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Reply
          </button>
        )}
        </div>
      </div>
    </Layout>
  );
}
