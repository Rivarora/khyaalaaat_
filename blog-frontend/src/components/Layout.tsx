import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";
import GlowingParticles from "./GlowingParticles";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isLight
          ? "text-gray-800 bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-100"
          : "text-white bg-gradient-to-br from-[#090012] via-[#16052b] to-[#070014]"
      }`}
    >
      <GlowingParticles />

      <div className="relative z-10">
        <Sidebar />

        <main className="px-4 py-4 md:px-8 md:py-8 flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;