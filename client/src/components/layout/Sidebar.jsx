import {
  Bell,
  BedDouble,
  CalendarCheck,
  CreditCard,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    path: "/student",
    icon: Home,
  },
  {
    label: "My Room",
    path: "/student/room",
    icon: BedDouble,
  },
  {
    label: "Attendance",
    path: "/student/attendance",
    icon: CalendarCheck,
  },
  {
    label: "Fees & Payments",
    path: "/student/fees",
    icon: CreditCard,
  },
  {
    label: "Leave",
    path: "/student/leave",
    icon: FileText,
  },
  {
    label: "Visitors",
    path: "/student/visitors",
    icon: Bell,
  },
  {
    label: "Complaints",
    path: "/student/complaints",
    icon: MessageSquare,
  },
  {
    label: "Notifications",
    path: "/student/notifications",
    icon: Bell,
  },
];

function Sidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#241719]/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[280px]
          flex-col border-r border-[#E3CFAD]
          bg-[#FFF9EF]
          shadow-[10px_0_40px_rgba(90,23,37,0.08)]
          transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-[78px] items-center justify-between border-b border-[#E3CFAD] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5A1725] text-sm font-black text-[#FFF9EF] shadow-[0_8px_20px_rgba(90,23,37,0.25)]">
              HM
            </div>

            <div>
              <p className="font-bold text-[#241719]">
                Hostel Management
              </p>

              <p className="text-xs text-[#604B4F]">
                Student Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-[#F3E8D0] lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#604B4F]">
            Menu
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/student"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group flex items-center gap-3 rounded-2xl px-4 py-3
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#5A1725] text-[#FFF9EF] shadow-[0_8px_20px_rgba(90,23,37,0.2)]"
                        : "text-[#604B4F] hover:bg-[#F3E8D0] hover:text-[#5A1725]"
                    }
                    `
                  }
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-[#E3CFAD] p-4">
          <div className="mb-3 rounded-2xl bg-[#F3E8D0] p-4">
            <p className="text-sm font-bold text-[#5A1725]">
              Need help?
            </p>

            <p className="mt-1 text-xs leading-5 text-[#604B4F]">
              Contact your hostel warden for assistance.
            </p>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#9B2C2C] transition hover:bg-[#FBEAEA]"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;