import { useState, type ReactNode } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isLight
          ? "text-gray-800 bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-100"
          : "text-white bg-gradient-to-br from-[#090012] via-[#16052b] to-[#070014]"
      }`}
    >
      <GlowingParticles />

      <div className="relative z-10 md:flex md:min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 md:hidden">
            <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
          </div>

          <main className="px-4 py-4 md:px-8 md:py-8 flex-1 min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;