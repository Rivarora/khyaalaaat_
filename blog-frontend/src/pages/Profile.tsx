import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

interface ProfileData {
  id: number;
  username: string;
  bio: string;
  profile_picture: string;
  bookmarked_poems: {
    id: number;
    title: string;
    content: string;
  }[];
}

const Profile = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { id } = useParams();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const token = localStorage.getItem("token");

  let decoded: any = null;
  try {
    if (token) decoded = JSON.parse(atob(token.split(".")[1]));
  } catch {}

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data);
      setBio(res.data.bio || "");
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  /* ================= UPDATE PROFILE ================= */

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", bio);

      if (image) {
        formData.append("profile_picture", image);
      }

      await api.put(`/users/${decoded.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated ✨");
      setIsEditOpen(false);
      fetchProfile();
    } catch {
      toast.error("Update failed");
    }
  };

  if (!profile) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">

        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center text-center">

          {/* PROFILE IMAGE */}
          <div className="border-4 border-purple-500 rounded-full p-1 mb-6">
            <img
              src={
                profile.profile_picture
                  ? `http://localhost:3000${profile.profile_picture}`
                  : "https://via.placeholder.com/150"
              }
              className="w-40 h-40 rounded-full object-cover"
            />
          </div>

          {/* USERNAME */}
          <h1 className={`text-4xl font-serif mb-4 ${isLight ? "text-fuchsia-700" : "text-purple-200"}`}>
            {profile.username}
          </h1>

          {/* BIO */}
          <p className={`italic max-w-lg mb-6 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            "{profile.bio || "This soul speaks through silence."}"
          </p>

          {/* EDIT BUTTON */}
          {decoded?.id === profile.id && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="bg-purple-600 px-6 py-2 rounded-full hover:bg-purple-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* BOOKMARKED POEMS */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className={`text-2xl mb-8 text-center ${isLight ? "text-fuchsia-700" : "text-purple-300"}`}>
            🔖 Saved Poems
          </h2>

          {profile.bookmarked_poems?.length === 0 ? (
            <p className={`text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              No saved poems yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {profile.bookmarked_poems.map((poem) => (
                <motion.div
                  key={poem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`backdrop-blur-lg p-6 rounded-2xl border ${
                    isLight ? "bg-white/70 border-pink-200 text-gray-800" : "bg-white/5 border-white/10"
                  }`}
                >
                  <h3 className={`text-xl mb-3 ${isLight ? "text-fuchsia-700" : "text-purple-200"}`}>
                    {poem.title}
                  </h3>

                  <p className={`whitespace-pre-line ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {poem.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 p-8 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-xl mb-6 text-purple-200">
                Edit Profile
              </h3>

              {/* IMAGE */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                  }
                }}
                className="mb-4 w-full text-gray-300"
              />

              {/* BIO */}
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write your bio..."
                className="w-full p-3 mb-6 rounded bg-gray-800 text-white"
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Profile;