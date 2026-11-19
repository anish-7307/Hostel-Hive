import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Navbar({ onMenuClick }) {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const initials = (user?.name || "Student")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const value = search.trim().toLowerCase();

    const routes = [
      ["dashboard", "/student"],
      ["room", "/student/room"],
      ["attendance", "/student/attendance"],
      ["fee", "/student/fees"],
      ["payment", "/student/fees"],
      ["leave", "/student/leave"],
      ["visitor", "/student/visitors"],
      ["complaint", "/student/complaints"],
      ["notification", "/student/notifications"],
      ["notice", "/student/notifications"],
    ];

    const match = routes.find(([label]) => value.includes(label));
    if (match) {
      navigate(match[1]);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  const handleProfileSave = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateUser({
      name: form.get("name").toString().trim(),
      email: form.get("email").toString().trim(),
    });
    setProfileModalOpen(false);
  };

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
            <form onSubmit={handleSearchSubmit}>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="w-48 bg-transparent text-sm outline-none placeholder:text-[#604B4F]"
                aria-label="Search"
              />
            </form>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            onClick={() => navigate("/student/notifications")}
            className="relative rounded-xl p-2.5 text-[#604B4F] transition hover:bg-[#F3E8D0] hover:text-[#5A1725]"
            aria-label="Notifications"
          >
            <Bell size={21} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#7A2638]" />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#E3CFAD] sm:block" />

          {/* Profile */}
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            className="flex items-center gap-3 rounded-2xl p-1.5 pr-2 transition hover:bg-[#F3E8D0]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A1725] text-sm font-bold text-[#FFF9EF]">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold">
                {user?.name || "Student"}
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

          {profileOpen && (
            <div className="absolute right-4 top-[68px] z-50 w-72 rounded-[22px] border border-[#E3CFAD] bg-[#FFF9EF] p-3 shadow-[0_18px_50px_rgba(90,23,37,0.18)] sm:right-6">
              <div className="rounded-2xl bg-[#F8EEDC] p-4">
                <p className="font-bold">{user?.name || "Anish Rai"}</p>
                <p className="mt-1 truncate text-xs text-[#604B4F]">{user?.email || "No email available"}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#7A2638]">{user?.role || "student"} account</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  setProfileModalOpen(true);
                }}
                className="mt-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-[#F3E8D0]"
              >
                Edit profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/student/notifications");
                }}
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-[#F3E8D0]"
              >
                View notifications
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#9B2C2C] hover:bg-[#FBEAEA]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {profileModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit profile"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#241719]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setProfileModalOpen(false);
          }}
        >
          <form
            onSubmit={handleProfileSave}
            className="w-full max-w-md rounded-[28px] border border-[#E3CFAD] bg-[#FFF9EF] p-6 shadow-[0_25px_70px_rgba(90,23,37,0.25)]"
          >
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <p className="mt-1 text-sm text-[#604B4F]">Update your account information</p>
            <label className="mt-5 block text-sm font-semibold">
              Full name
              <input name="name" required defaultValue={user?.name || "Anish Rai"} className="form-control mt-2" />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Email
              <input name="email" required type="email" defaultValue={user?.email || "student@demo.com"} className="form-control mt-2" />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="rounded-xl border border-[#E3CFAD] px-4 py-2.5 text-sm font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-[#5A1725] px-4 py-2.5 text-sm font-bold text-[#FFF9EF]">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}

export default Navbar;