import type { FC } from "react";

interface Props {
  onToggleSidebar?: () => void;
}

const Navbar: FC<Props> = ({ onToggleSidebar }) => {
  return (
    <header className="w-full flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 py-3 border-b md:border-b-0 md:border-l shadow-sm bg-transparent min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden flex-shrink-0 px-3 py-2 rounded-lg border hover:bg-white/5"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <h1 className="text-base sm:text-lg font-semibold text-center md:text-left truncate min-w-0">
          Khyaalaaat
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {/* reserved for future controls */}
      </div>
    </header>
  );
};

export default Navbar;
