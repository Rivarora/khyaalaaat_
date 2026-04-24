import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import GlowingParticles from "../components/GlowingParticles";
import { useTheme } from "../context/ThemeContext";

interface Post {
  id: number;
  title: string;
  content: string;
  genre: string;
  likes_count: number;
  comments_count: number;
}

interface Comment {
  id: number;
  username: string;
  content: string;
}

const Dashboard = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const genres = [
    "All", "Love", "Sad", "Motivational",
    "Funny", "Nature", "Friendship", "Parents", "Other",
  ];

  const [activeGenre, setActiveGenre] = useState("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("Other");  // ← genre for the modal dropdown
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [animatedLike, setAnimatedLike] = useState<number | null>(null);
  const [animatedBookmark, setAnimatedBookmark] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  let decoded: any = null;
  try {
    if (token) decoded = JSON.parse(atob(token.split(".")[1]));
  } catch {}

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data.posts);
    } catch {
      toast.error("Failed to load poems");
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async () => {
    if (!title || !content) { toast.error("All fields required"); return; }
    try {
      if (editId) {
        await api.put(
          `/posts/${editId}`,
          { title, content, genre },   // ✅ genre from dropdown state
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Poem updated ✨");
      } else {
        await api.post(
          "/posts",
          { title, content, genre },   // ✅ genre from dropdown state, NOT activeGenre
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Poem published 🌙");
      }
      setIsOpen(false);
      setEditId(null);
      setTitle("");
      setContent("");
      setGenre("Other");
      fetchPosts();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Poem removed 🖤");
      fetchPosts();
    } catch { toast.error("Delete failed"); }
  };

  const handleLike = async (id: number) => {
    try {
      setAnimatedLike(id);
      await api.post(`/posts/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchPosts();
      setTimeout(() => setAnimatedLike(null), 400);
    } catch { toast.error("Like failed"); }
  };

  const handleBookmark = async (id: number) => {
    try {
      setAnimatedBookmark(id);
      await api.post(`/posts/${id}/bookmark`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchPosts();
      setTimeout(() => setAnimatedBookmark(null), 400);
    } catch { toast.error("Bookmark failed"); }
  };

  const fetchComments = async (id: number) => {
    try {
      const res = await api.get(`/posts/${id}/comments`);
      setComments((prev) => ({ ...prev, [id]: res.data }));
    } catch { toast.error("Failed to load comments"); }
  };

  const handleComment = async (id: number) => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/posts/${id}/comment`, { content: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setNewComment("");
      fetchComments(id);
      fetchPosts();
    } catch { toast.error("Comment failed"); }
  };

  // ── FILTER ────────────────────────────────────────────────────────────────
  const filteredPosts = posts.filter((post) => {
    if (activeGenre === "All") return true;
    return (post.genre || "Other").trim().toLowerCase() === activeGenre.trim().toLowerCase();
  });

  // ── Theme classes ─────────────────────────────────────────────────────────
  const bgGradient = isLight
    ? "bg-white/35 backdrop-blur-[1px]"
    : "bg-black/20";
  const titleColor = isLight ? "text-purple-700 drop-shadow-sm" : "text-yellow-400";
  const subtitleColor = isLight ? "text-fuchsia-500" : "text-gray-400";
  const cardBg = isLight
    ? "bg-white/60 backdrop-blur-xl border-pink-100 shadow-xl shadow-pink-100/50 hover:shadow-fuchsia-200/50"
    : "bg-white/5 backdrop-blur-xl border-white/10";
  const cardTitle = isLight ? "text-purple-700" : "text-yellow-300";
  const cardText = isLight ? "text-gray-600" : "text-gray-300";
  const genreActive = isLight
    ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-md shadow-pink-200"
    : "bg-yellow-400 text-black";
  const genreInactive = isLight
    ? "bg-white/50 border border-pink-200 text-purple-600 hover:bg-white/70 backdrop-blur"
    : "border border-white/10 text-gray-300 hover:border-yellow-400";
  const profileBtn = isLight
    ? "bg-white/60 border border-pink-300 text-purple-700 hover:bg-white/80 backdrop-blur"
    : "bg-gray-800 text-white hover:bg-gray-700";
  const publishBtn = isLight
    ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:from-fuchsia-600 hover:to-pink-600 shadow-pink-200"
    : "bg-purple-600 hover:bg-purple-700 text-white";
  const commentBg = isLight ? "bg-pink-50/80 border border-pink-100" : "bg-black/40";
  const commentInput = isLight
    ? "bg-white border border-pink-200 text-gray-800 placeholder-pink-300"
    : "bg-gray-800 text-white";
  const selectClass = isLight
    ? "bg-white border border-pink-200 text-gray-800"
    : "bg-gray-800 text-white border border-gray-700";


  return (
    <Layout>
      <div className={`relative min-h-full py-10 px-4 overflow-hidden transition-all duration-700 ${bgGradient}`}>

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

        {/* HEADER */}
        <div className="text-center mb-16 relative">
          <motion.h1 key={theme} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`text-5xl font-serif mb-4 ${titleColor}`}>
            Khyaalaat
          </motion.h1>
          <p className={`text-sm tracking-widest ${subtitleColor}`}>Thoughts rendered in verse and color.</p>

          {decoded && (
            <div className="absolute top-0 right-0">
              <Link to={`/profile/${decoded.id}`} className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${profileBtn}`}>
                👤 Profile
              </Link>
            </div>
          )}

          {decoded?.role === "admin" && (
            <button
              onClick={() => { setEditId(null); setTitle(""); setContent(""); setGenre("Other"); setIsOpen(true); }}
              className={`mt-8 px-8 py-3 rounded-full shadow-lg transition-all duration-300 ${publishBtn}`}
            >
              + Publish New Poem
            </button>
          )}
        </div>

        {/* GENRE FILTER */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-5 py-2 rounded-xl text-sm transition-all duration-300 ${activeGenre === g ? genreActive : genreInactive}`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* RESULTS COUNT */}
        <p className={`text-center text-xs mb-10 ${isLight ? "text-fuchsia-400" : "text-gray-500"}`}>
          {filteredPosts.length === 0
            ? `No poems in "${activeGenre}" yet`
            : `${filteredPosts.length} poem${filteredPosts.length !== 1 ? "s" : ""}${activeGenre !== "All" ? ` in "${activeGenre}"` : ""}`}
        </p>

        {/* POSTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`p-8 rounded-3xl border hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between min-h-[420px] relative ${cardBg}`}
            >
              {isLight && <div className="absolute top-4 right-6 text-xl opacity-30 select-none pointer-events-none">🌸</div>}

              {post.genre && (
                <span className={`text-xs px-3 py-1 rounded-full w-fit mb-3 ${
                  isLight ? "bg-pink-100 text-fuchsia-600 border border-pink-200" : "bg-white/10 text-purple-300 border border-white/10"
                }`}>
                  {post.genre}
                </span>
              )}

              <h2 className={`text-2xl font-serif mb-6 ${cardTitle}`}>{post.title}</h2>
              <p className={`whitespace-pre-line leading-8 text-base flex-grow ${cardText}`}>{post.content}</p>

              <div className="flex justify-center gap-10 mt-6 text-sm">
                <motion.button onClick={() => handleLike(post.id)} animate={animatedLike === post.id ? { scale: [1, 1.6, 1] } : {}} transition={{ duration: 0.4 }} className="text-pink-400 hover:text-pink-500">
                  ❤️ {post.likes_count}
                </motion.button>
                <motion.button onClick={() => handleBookmark(post.id)} animate={animatedBookmark === post.id ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.3 }} className="text-yellow-500 hover:text-yellow-600">
                  🔖
                </motion.button>
                <button onClick={() => fetchComments(post.id)} className="text-blue-400 hover:text-blue-500">
                  💬 {post.comments_count}
                </button>
              </div>

              {decoded?.role === "admin" && (
                <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-500 mt-4">Delete</button>
              )}

              {comments[post.id] && (
                <div className={`p-4 rounded-xl mt-6 text-sm ${commentBg}`}>
                  {comments[post.id].map((c) => (
                    <div key={c.id} className="mb-1">
                      <strong className={isLight ? "text-fuchsia-600" : "text-purple-300"}>{c.username}</strong>{" "}
                      <span className={cardText}>— {c.content}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-3">
                    <input value={newComment} onChange={(e) => setNewComment(e.target.value)} className={`flex-1 p-2 rounded ${commentInput}`} placeholder="Leave a thought..." />
                    <button onClick={() => handleComment(post.id)} className={`px-3 rounded text-white ${isLight ? "bg-fuchsia-500 hover:bg-fuchsia-600" : "bg-purple-600 hover:bg-purple-700"}`}>Send</button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            isLight ? "bg-white/40 backdrop-blur-sm" : "bg-black/75 backdrop-blur-sm"
          }`}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-10 rounded-3xl w-full max-w-lg shadow-2xl border ${
              isLight
                ? "bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-100 text-gray-800 border-pink-200"
                : "bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764] text-purple-100 border-violet-400/30"
            }`}
          >
            <h3 className={`text-2xl mb-8 font-serif ${isLight ? "text-purple-700" : "text-purple-200"}`}>
              {editId ? "Edit Poem" : "Publish Poem"}
            </h3>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 mb-5 rounded-xl border ${
                isLight
                  ? "bg-white border-pink-200 text-gray-800 placeholder-pink-300"
                  : "bg-white/10 border-violet-300/25 text-white placeholder-purple-300"
              }`}
            />

            {/* GENRE DROPDOWN — controls the `genre` state variable */}
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={`w-full p-3 mb-5 rounded-xl border appearance-none ${selectClass}`}
            >
              {genres.filter((g) => g !== "All").map((g) => (
                <option
                  key={g}
                  value={g}
                  style={{
                    backgroundColor: isLight ? "#ffffff" : "#1e1b4b",
                    color: isLight ? "#1f2937" : "#f3e8ff",
                  }}
                >
                  {g}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Write your poem..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full p-3 mb-8 rounded-xl h-48 border ${
                isLight
                  ? "bg-white border-pink-200 text-gray-800 placeholder-pink-300"
                  : "bg-white/10 border-violet-300/25 text-white placeholder-purple-300"
              }`}
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className={`px-5 py-2 rounded-xl ${
                  isLight
                    ? "bg-pink-100 hover:bg-pink-200 text-gray-700"
                    : "bg-violet-900/60 hover:bg-violet-800/70 text-purple-100 border border-violet-400/20"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-6 py-2 rounded-xl text-white ${
                  isLight
                    ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                    : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700"
                }`}
              >
                {editId ? "Update" : "Publish"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;