import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#E3CFAD] bg-[#FFF9EF]/90 backdrop-blur-xl">
      <div className="flex h-[78px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl border border-[#E3CFAD] bg-[#FFF9EF] p-2.5 text-[#5A1725] shadow-sm transition hover:bg-[#F3E8D0] lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={21} />
          </button>

          <div className="hidden items-center gap-2 rounded-2xl border border-[#E3CFAD] bg-[#F8EEDC] px-4 py-2.5 md:flex">
            <Search size={17} className="text-[#604B4F]" />

            <input
              type="search"
              placeholder="Search..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-[#604B4F]"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            className="relative rounded-xl p-2.5 text-[#604B4F] transition hover:bg-[#F3E8D0] hover:text-[#5A1725]"
            aria-label="Notifications"
          >
            <Bell size={21} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#7A2638]" />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#E3CFAD] sm:block" />

          {/* Profile */}
          <button className="flex items-center gap-3 rounded-2xl p-1.5 pr-2 transition hover:bg-[#F3E8D0]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A1725] text-sm font-bold text-[#FFF9EF]">
              AR
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold">
                {user?.name || "Anish Rai"}
              </p>

              <p className="text-xs capitalize text-[#604B4F]">
                {user?.role || "student"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-[#604B4F] sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;