import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";
import GlowingParticles from "./GlowingParticles";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`relative flex min-h-screen transition-colors duration-500 ${
      isLight
        ? "bg-gradient-to-br from-rose-100 via-fuchsia-50 to-violet-100 text-gray-800"
        : "bg-gradient-to-br from-black via-purple-950 to-gray-950 text-white"
    }`}>
      <GlowingParticles />
      <div className="relative z-10">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <Navbar />

        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;