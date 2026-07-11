import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import GlowingParticles from "../components/GlowingParticles";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center ${
      isLight
        ? "bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-100"
        : "bg-gradient-to-br from-[#05050f] via-[#140a2f] to-[#1e0c3d]"
    }`}>
      <GlowingParticles />
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 z-20 px-4 py-2 rounded-full border backdrop-blur transition ${
          isLight
            ? "bg-white/80 border-pink-200 text-fuchsia-700 hover:bg-white"
            : "bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20"
        }`}
        title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {isLight ? "Dark" : "Light"}
      </button>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 overflow-hidden backdrop-blur-2xl p-9 rounded-[28px] shadow-2xl w-[420px] ${
          isLight
            ? "bg-white/75 border border-pink-200 text-gray-800 shadow-pink-200/70"
            : "bg-white/10 border border-violet-300/20 text-white shadow-fuchsia-900/30"
        }`}
      >
        <div
          className={`absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl ${
            isLight ? "bg-pink-300/40" : "bg-fuchsia-500/20"
          }`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-52 h-52 rounded-full blur-3xl ${
            isLight ? "bg-cyan-200/50" : "bg-cyan-500/15"
          }`}
        />

        <div className="relative z-10">
          <p className={`text-xs tracking-[0.25em] uppercase text-center mb-2 ${isLight ? "text-fuchsia-500" : "text-fuchsia-300"}`}>
            Welcome Back
          </p>
          <h2 className={`text-4xl font-bold mb-2 text-center ${isLight ? "text-fuchsia-700" : "text-white"}`}>
            Sign In
          </h2>
          <p className={`text-sm text-center mb-7 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            Continue your poetry journey
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className={`block mb-2 text-sm ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                Email
              </label>
              <input
                type="email"
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition ${
                  isLight ? "bg-white border-pink-200 text-gray-800" : "bg-white/10 border-white/20 text-white"
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className={`block mb-2 text-sm ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                Password
              </label>
              <input
                type="password"
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition ${
                  isLight ? "bg-white border-pink-200 text-gray-800" : "bg-white/10 border-white/20 text-white"
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end mb-6">
              <button type="button" className={`text-xs ${isLight ? "text-fuchsia-600" : "text-fuchsia-300"}`}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-semibold transition duration-300 text-white ${
                isLight
                  ? "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:from-fuchsia-600 hover:via-pink-600 hover:to-rose-600"
                  : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700"
              }`}
            >
              Login
            </button>
          </form>

          <p className={`text-sm text-center mt-6 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className={isLight ? "text-fuchsia-700 font-semibold hover:underline" : "text-fuchsia-300 font-semibold hover:underline"}
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
