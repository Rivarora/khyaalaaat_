import type { ReactNode } from "react";
import { useState } from "react";
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

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isLight
          ? "text-gray-800 bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-100"
          : "text-white bg-gradient-to-br from-[#090012] via-[#16052b] to-[#070014]"
      }`}
    >
      <GlowingParticles />

      <div className="relative z-10 flex flex-col md:flex-row">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

          <main className="p-3 sm:p-4 md:p-8 flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;