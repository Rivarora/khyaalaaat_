import type { FC } from "react";

interface Props {
  onToggleSidebar?: () => void;
}

const Navbar: FC<Props> = ({ onToggleSidebar }) => {
  return (
    <header className="w-full flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b md:border-b-0 md:border-l shadow-sm bg-transparent">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden px-3 py-2 rounded-lg border hover:bg-white/5"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold flex-1 text-center md:text-left">Khyaalaaat</h1>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {/* reserved for future controls */}
      </div>
    </header>
  );
};

export default Navbar;
