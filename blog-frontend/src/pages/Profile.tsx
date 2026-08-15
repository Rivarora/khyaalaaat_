import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const assetsBaseUrl = import.meta.env.VITE_ASSETS_BASE_URL || "http://localhost:3000";

interface BookmarkedPoem {
  id: string;
  title: string;
  content: string;
}

interface ProfileData {
  id: string;
  _id?: string;
  username: string;
  bio: string;
  profile_picture: string;
  bookmarked_poems: Array<BookmarkedPoem | null>;
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

      const normalizedProfile = {
        ...res.data,
        id: res.data.id?.toString() || res.data._id?.toString(),
        bookmarked_poems: (res.data.bookmarked_poems || []).map((poem: any) => ({
          ...poem,
          id: poem.id?.toString() || poem._id?.toString(),
        })),
      };

      setProfile(normalizedProfile);
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
        },
      });

      toast.success("Profile updated ✨");
      setIsEditOpen(false);
      fetchProfile();
      window.dispatchEvent(new Event("profile-updated"));
    } catch {
      toast.error("Update failed");
    }
  };

  if (!profile) return <Layout>Loading...</Layout>;

  const bookmarkedPoems = (profile.bookmarked_poems ?? []).filter(
    (poem): poem is BookmarkedPoem => Boolean(poem?.id)
  );

  return (
    <Layout>
      <div className={`relative min-h-full py-12 px-4 transition-all duration-700 ${
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

        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center text-center">

          {/* PROFILE IMAGE */}
          <div className="border-4 border-purple-500 rounded-full p-1 mb-6">
            <img
              src={
                profile.profile_picture
                  ? `${assetsBaseUrl}${profile.profile_picture}`
                  : "https://via.placeholder.com/150"
              }
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover"
            />
          </div>

          {/* USERNAME */}
          <h1 className={`text-3xl sm:text-4xl font-serif mb-4 break-words ${isLight ? "text-fuchsia-700" : "text-purple-200"}`}>
            {profile.username}
          </h1>

          {/* BIO */}
          <p className={`italic max-w-lg mb-6 break-words ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            "{profile.bio || "This soul speaks through silence."}"
          </p>

          {/* EDIT BUTTON */}
          {decoded?.id === profile.id && (
            <button
              onClick={() => setIsEditOpen(true)}
              className={`px-6 py-2 rounded-full text-white ${
                isLight
                  ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
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

          {bookmarkedPoems.length === 0 ? (
            <p className={`text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              No saved poems yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
              {bookmarkedPoems.map((poem) => (
                <motion.div
                  key={poem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`backdrop-blur-lg p-5 sm:p-6 rounded-2xl border break-words ${
                    isLight ? "bg-white/70 border-pink-200 text-gray-800" : "bg-white/5 border-white/10"
                  }`}
                >
                  <h3 className={`text-xl mb-3 break-words ${isLight ? "text-fuchsia-700" : "text-purple-200"}`}>
                    {poem.title}
                  </h3>

                  <p className={`whitespace-pre-line break-words ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {poem.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 p-5 sm:p-8 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                className="mb-4 w-full max-w-full text-gray-300"
              />

              {/* BIO */}
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write your bio..."
                className="w-full max-w-full p-3 mb-6 rounded bg-gray-800 text-white"
              />

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="w-full sm:w-auto px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
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