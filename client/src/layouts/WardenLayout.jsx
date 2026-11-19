import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckSquare,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const navigation = [
  { label: "Dashboard", to: "/warden", icon: LayoutDashboard, end: true },
  { label: "Students", to: "/warden/students", icon: Users },
  { label: "Attendance", to: "/warden/attendance", icon: CheckSquare },
  { label: "Leave Requests", to: "/warden/leave-requests", icon: CalendarCheck },
  { label: "Complaints", to: "/warden/complaints", icon: ClipboardList },
];

function WardenLayout() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateUser({
      name: form.get("name").toString().trim(),
      email: form.get("email").toString().trim(),
    });
    setProfileModalOpen(false);
  };

  const initials = (user?.name || "Warden")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F3E8D0] text-[#241719]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#241719]/50 lg:hidden"
        />
      )}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-[#E3CFAD] bg-[#FFF9EF] transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[78px] items-center justify-between border-b border-[#E3CFAD] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5A1725] font-black text-[#FFF9EF]">HH</div>
            <div><p className="font-bold">Hostel Hive</p><p className="text-xs text-[#604B4F]">Warden Portal</p></div>
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 lg:hidden" aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-2 p-4" aria-label="Warden navigation">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-[#5A1725] text-white" : "text-[#604B4F] hover:bg-[#F3E8D0]"}`}
            >
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#E3CFAD] p-4">
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#9B2C2C] hover:bg-[#FBEAEA]">
            <LogOut size={19} /> Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#E3CFAD] bg-[#FFF9EF]/95 px-5 backdrop-blur lg:px-8">
          <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-xl border border-[#E3CFAD] p-2.5 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button>
          <div className="ml-auto flex items-center gap-3">
            <button type="button" onClick={() => navigate("/warden/leave-requests")} className="relative rounded-xl p-2.5 hover:bg-[#F3E8D0]" aria-label="View pending requests">
              <Bell size={21} />
            </button>
            <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} className="flex items-center gap-3 rounded-2xl p-1.5 hover:bg-[#F3E8D0]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A1725] text-sm font-bold text-white">{initials}</span>
              <span className="hidden text-left sm:block"><span className="block text-sm font-bold">{user?.name || "Warden"}</span><span className="block text-xs capitalize text-[#604B4F]">{user?.role}</span></span>
              <ChevronDown size={16} />
            </button>
            {profileOpen && (
              <div className="absolute right-5 top-[68px] z-50 w-64 rounded-[20px] border border-[#E3CFAD] bg-[#FFF9EF] p-3 shadow-xl">
                <p className="truncate px-3 py-2 text-xs text-[#604B4F]">{user?.email}</p>
                <button type="button" onClick={() => { setProfileOpen(false); setProfileModalOpen(true); }} className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-[#F3E8D0]">Edit profile</button>
                <button type="button" onClick={handleLogout} className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#9B2C2C] hover:bg-[#FBEAEA]">Logout</button>
              </div>
            )}
          </div>
        </header>

        <Outlet />
      </div>

      {profileModalOpen && (
        <div role="dialog" aria-modal="true" aria-label="Edit profile" className="fixed inset-0 z-[60] flex items-center justify-center bg-[#241719]/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && setProfileModalOpen(false)}>
          <form onSubmit={saveProfile} className="w-full max-w-md rounded-[28px] bg-[#FFF9EF] p-6">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <label className="mt-5 block text-sm font-semibold">Full name<input name="name" required defaultValue={user?.name || ""} className="form-control mt-2" /></label>
            <label className="mt-4 block text-sm font-semibold">Email<input name="email" required type="email" defaultValue={user?.email || ""} className="form-control mt-2" /></label>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setProfileModalOpen(false)} className="rounded-xl border border-[#E3CFAD] px-4 py-2.5 text-sm font-bold">Cancel</button>
              <button type="submit" className="rounded-xl bg-[#5A1725] px-4 py-2.5 text-sm font-bold text-white">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default WardenLayout;
