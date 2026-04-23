import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className={`text-3xl font-bold ${isLight ? "text-fuchsia-700" : "text-yellow-300"}`}>My Poem Requests</h2>

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
              Status:{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  r.status === "completed" ? "bg-green-600" : "bg-yellow-600"
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
                isLight ? "bg-fuchsia-50 border-fuchsia-100" : "bg-black/30 border-white/10"
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
                  : "bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700"
              }`}
            >
              Delete Request
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}