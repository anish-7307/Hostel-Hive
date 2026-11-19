import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckSquare,
  ChevronDown,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  TrendingUp,
  Users,
  UserPlus,
  X,
  WalletCards,
  Wrench,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { apiRequest } from "../../lib/api";

const blocks = [
  { name: "Block A", rooms: 84, occupied: 76, students: 228, status: "Healthy" },
  { name: "Block B", rooms: 72, occupied: 61, students: 183, status: "Healthy" },
  { name: "Block C", rooms: 94, occupied: 78, students: 234, status: "Attention" },
];

const initialExpenses = [
  { id: 1, title: "Kitchen equipment repair", block: "Mess", amount: "₹18,500", status: "Pending" },
  { id: 2, title: "Block C plumbing", block: "Block C", amount: "₹32,000", status: "Approved" },
  { id: 3, title: "Housekeeping supplies", block: "All blocks", amount: "₹14,800", status: "Approved" },
];

const staffDepartments = ["Warden", "Security", "Housekeeping", "Kitchen", "Maintenance", "Other"];

function getToday() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

function OwnerDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [period, setPeriod] = useState("This Month");
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState(initialExpenses);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [staff, setStaff] = useState([]);
  const [staffDate, setStaffDate] = useState(getToday);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState("");
  const [staffSaving, setStaffSaving] = useState(false);
  const [staffSuccess, setStaffSuccess] = useState("");
  const [staffReload, setStaffReload] = useState(0);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [staffCreating, setStaffCreating] = useState(false);
  const [workEdit, setWorkEdit] = useState(null);

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

  const approveExpense = (id) => {
    setExpenses((current) => current.map((item) => item.id === id ? { ...item, status: "Approved" } : item));
  };

  const createStaff = async (event) => {
    event.preventDefault();
    setStaffCreating(true);
    setStaffError("");
    setStaffSuccess("");
    const formData = new FormData(event.currentTarget);
    try {
      await apiRequest("/owner/staff", {
        method: "POST",
        body: Object.fromEntries(formData.entries()),
      });
      setStaffFormOpen(false);
      setStaffSuccess("Staff member added.");
      setStaffLoading(true);
      setStaffReload((current) => current + 1);
    } catch (requestError) {
      setStaffError(requestError.message);
    } finally {
      setStaffCreating(false);
    }
  };

  const updateStaffAttendance = (staffId, attendanceStatus) => {
    setStaffSuccess("");
    setStaff((current) => current.map((member) => (
      member._id === staffId ? { ...member, attendanceStatus } : member
    )));
  };

  const markAllStaffPresent = () => {
    setStaffSuccess("");
    setStaff((current) => current.map((member) => ({ ...member, attendanceStatus: "Present" })));
  };

  const saveStaffAttendance = async () => {
    if (!staff.length) {
      setStaffError("Add staff members before saving attendance.");
      return;
    }
    setStaffSaving(true);
    setStaffError("");
    setStaffSuccess("");
    try {
      const result = await apiRequest("/owner/staff/attendance", {
        method: "PUT",
        body: {
          date: staffDate,
          entries: staff.map((member) => ({
            staffId: member._id,
            status: member.attendanceStatus,
          })),
        },
      });
      setStaffSuccess(`Attendance saved: ${result.data.savedCount} marked, ${result.data.clearedCount} cleared.`);
      setStaffLoading(true);
      setStaffReload((current) => current + 1);
    } catch (requestError) {
      setStaffError(requestError.message);
    } finally {
      setStaffSaving(false);
    }
  };

  const saveStaffWork = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const assignedWork = formData.get("assignedWork").toString().trim();
    setStaffError("");
    setStaffSuccess("");
    try {
      const result = await apiRequest(`/owner/staff/${workEdit.staffId}/work`, {
        method: "PATCH",
        body: { assignedWork },
      });
      setStaff((current) => current.map((member) => (
        member._id === result.data._id
          ? { ...member, assignedWork: result.data.assignedWork }
          : member
      )));
      setWorkEdit(null);
      setStaffSuccess("Assigned work updated.");
    } catch (requestError) {
      setStaffError(requestError.message);
    }
  };

  const filteredBlocks = blocks.filter((block) =>
    `${block.name} ${block.status}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredExpenses = expenses.filter((expense) =>
    `${expense.title} ${expense.block} ${expense.status}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredStudents = useMemo(() => students.filter((student) =>
    `${student.fullName} ${student.studentId || ""} ${student.block || ""} ${student.roomNumber || ""} ${student.course || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ), [students, search]);
  const filteredStaff = useMemo(() => staff.filter((member) =>
    `${member.fullName} ${member.staffId} ${member.department} ${member.assignedWork} ${member.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ), [staff, search]);
  const studentGroups = useMemo(() => {
    const groups = new Map();
    for (const student of filteredStudents) {
      const block = student.block || "Unassigned";
      if (!groups.has(block)) groups.set(block, []);
      groups.get(block).push(student);
    }
    return [...groups.entries()].sort(([first], [second]) => first.localeCompare(second));
  }, [filteredStudents]);
  const staffCounts = useMemo(() => staff.reduce((counts, member) => {
    counts[member.attendanceStatus] += 1;
    return counts;
  }, { Present: 0, Absent: 0, Leave: 0, "Not Marked": 0 }), [staff]);

  useEffect(() => {
    if (activeSection !== "students") return undefined;
    let active = true;
    apiRequest("/owner/students")
      .then((result) => {
        if (active) setStudents(result.data);
      })
      .catch((requestError) => {
        if (active) setStudentsError(requestError.message);
      })
      .finally(() => {
        if (active) setStudentsLoading(false);
      });
    return () => { active = false; };
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "staff") return undefined;
    let active = true;
    apiRequest(`/owner/staff?date=${encodeURIComponent(staffDate)}`)
      .then((result) => {
        if (active) setStaff(result.data);
      })
      .catch((requestError) => {
        if (active) setStaffError(requestError.message);
      })
      .finally(() => {
        if (active) setStaffLoading(false);
      });
    return () => { active = false; };
  }, [activeSection, staffDate, staffReload]);

  const navItems = [
    ["Overview", LayoutDashboard, "overview"],
    ["Properties", Building2, "properties"],
    ["Students", Users, "students"],
    ["Staff", UserPlus, "staff"],
    ["Revenue", WalletCards, "revenue"],
    ["Expenses", Wrench, "expenses"],
  ];

  return (
    <div className="min-h-screen bg-[#F3E8D0] text-[#241719]">
      {sidebarOpen && (
        <button type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-[#241719]/50 lg:hidden" />
      )}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-[#E3CFAD] bg-[#FFF9EF] transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[78px] items-center justify-between border-b border-[#E3CFAD] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5A1725] font-black text-[#FFF9EF]">HH</div>
            <div><p className="font-bold">Hostel Hive</p><p className="text-xs text-[#604B4F]">Owner Portal</p></div>
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 lg:hidden" aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="flex-1 space-y-2 p-4" aria-label="Owner navigation">
          {navItems.map(([label, Icon, target]) => (
            <button
              type="button"
              key={label}
              onClick={() => {
                setSidebarOpen(false);
                if (activeSection !== target && target === "students") {
                  setStudentsLoading(true);
                  setStudentsError("");
                }
                if (activeSection !== target && target === "staff") {
                  setStaffLoading(true);
                  setStaffError("");
                }
                setActiveSection(target);
              }}
              aria-current={activeSection === target ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeSection === target ? "bg-[#5A1725] text-white" : "text-[#604B4F] hover:bg-[#F3E8D0]"}`}
            >
              <Icon size={19} /> {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-[#E3CFAD] p-4">
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#9B2C2C] hover:bg-[#FBEAEA]"><LogOut size={19} /> Logout</button>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#E3CFAD] bg-[#FFF9EF]/95 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-xl border border-[#E3CFAD] p-2.5 lg:hidden" aria-label="Open menu"><Menu size={21} /></button>
            <div className="hidden items-center gap-2 rounded-2xl border border-[#E3CFAD] bg-[#F8EEDC] px-4 py-2.5 md:flex">
              <Search size={17} className="text-[#604B4F]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this section..." className="w-60 bg-transparent text-sm outline-none" aria-label="Search current owner section" />
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <button type="button" onClick={() => setNotificationsOpen((open) => !open)} className="relative rounded-xl p-2.5 hover:bg-[#F3E8D0]" aria-label="Notifications">
              <Bell size={21} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#7A2638]" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-12 top-12 w-80 rounded-[20px] border border-[#E3CFAD] bg-[#FFF9EF] p-3 shadow-xl">
                <p className="px-2 py-2 text-sm font-bold">Notifications</p>
                {["Monthly revenue report is ready", "Block C occupancy needs review", "Kitchen repair request awaiting approval"].map((message) => (
                  <button type="button" key={message} onClick={() => setNotificationsOpen(false)} className="w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-[#F3E8D0]">{message}</button>
                ))}
              </div>
            )}
            <button type="button" onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-3 rounded-2xl p-1.5 hover:bg-[#F3E8D0]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A1725] text-sm font-bold text-white">DO</div>
              <div className="hidden text-left sm:block"><p className="text-sm font-bold">{user?.name || "Demo Owner"}</p><p className="text-xs text-[#604B4F]">Owner</p></div>
              <ChevronDown size={16} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-60 rounded-[20px] border border-[#E3CFAD] bg-[#FFF9EF] p-3 shadow-xl">
                <button type="button" onClick={() => { setProfileOpen(false); setProfileModalOpen(true); }} className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-[#F3E8D0]">Edit profile</button>
                <button type="button" onClick={handleLogout} className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#9B2C2C] hover:bg-[#FBEAEA]">Logout</button>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 lg:px-8">
          {activeSection === "overview" && (
            <>
              <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#5A1725] to-[#3D0D18] p-7 text-[#FFF9EF] sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C69C5A]">Owner Dashboard</p><h1 className="mt-2 text-3xl font-bold">Good morning, {user?.name || "Owner"} 👋</h1><p className="mt-3 text-sm text-[#F3E8D0]/80">Business overview across every hostel property.</p></div>
                  <select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white outline-none">
                    <option className="text-[#241719]">This Week</option>
                    <option className="text-[#241719]">This Month</option>
                    <option className="text-[#241719]">This Year</option>
                  </select>
                </div>
              </section>

              <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <OwnerMetric label="Total Revenue" value={period === "This Week" ? "₹4.82L" : period === "This Year" ? "₹58.4L" : "₹12.48L"} detail="+8.4% from last period" icon={IndianRupee} />
                <OwnerMetric label="Occupancy" value="86%" detail="645 of 750 beds" icon={Building2} />
                <OwnerMetric label="Active Students" value="645" detail="Across 3 blocks" icon={Users} />
                <OwnerMetric label="Net Profit" value="₹3.72L" detail="+12.1% growth" icon={TrendingUp} />
              </section>
            </>
          )}

          {activeSection !== "overview" && (
            <section className="flex flex-wrap items-end justify-between gap-4 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C69C5A]">Owner portal</p>
                <h1 className="mt-2 text-2xl font-bold">
                  {activeSection === "properties" ? "Properties" : activeSection === "students" ? "Students in hostels" : activeSection === "staff" ? "Staff & attendance" : activeSection === "revenue" ? "Revenue" : "Expenses"}
                </h1>
                <p className="mt-1 text-sm text-[#604B4F]">
                  {activeSection === "properties"
                    ? "Property occupancy and student distribution."
                    : activeSection === "students"
                      ? "Browse active residents by hostel block and room."
                      : activeSection === "staff"
                        ? "Manage staff responsibilities and daily attendance."
                        : activeSection === "revenue"
                          ? "Revenue and payment performance."
                          : "Review and approve property expenses."}
                </p>
              </div>
              {activeSection === "revenue" && (
                <label className="flex items-center gap-2 rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-3 py-2">
                  <span className="text-xs font-semibold text-[#604B4F]">Period</span>
                  <select value={period} onChange={(event) => setPeriod(event.target.value)} className="bg-transparent px-1 py-1 text-sm font-semibold outline-none">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>
                </label>
              )}
            </section>
          )}

          {activeSection === "revenue" && <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
              <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Revenue Overview</h2><p className="mt-1 text-sm text-[#604B4F]">{period} performance</p></div><span className="rounded-full bg-[#EAF3ED] px-3 py-1 text-xs font-bold text-[#28644B]">+8.4%</span></div>
              <div className="mt-8 flex h-52 items-end gap-3 border-b border-l border-[#E3CFAD] px-4 pb-2">
                {[38, 52, 46, 68, 61, 78, 72, 88, 82, 96, 91, 100].map((height, index) => (
                  <button type="button" key={index} title={`Period ${index + 1}: ${height}%`} className="group flex flex-1 items-end" onClick={() => setPeriod(index < 4 ? "This Week" : index < 9 ? "This Month" : "This Year")}>
                    <span className="w-full rounded-t-lg bg-[#7A2638] transition group-hover:bg-[#C69C5A]" style={{ height: `${height}%` }} />
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs text-[#604B4F]"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></div>
            </div>

            <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
              <h2 className="text-xl font-bold">Payment Summary</h2>
              <div className="mt-5 space-y-4">
                {[["Collected", "₹11.82L", 94], ["Pending", "₹66K", 5], ["Overdue", "₹18K", 1]].map(([label, value, percent]) => (
                  <div key={label}><div className="flex justify-between text-sm"><span className="font-semibold">{label}</span><span className="font-bold">{value}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E3CFAD]"><div className="h-full rounded-full bg-[#5A1725]" style={{ width: `${percent}%` }} /></div></div>
                ))}
              </div>
            </div>
          </section>}

          {activeSection === "properties" && <section className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
            <div><h2 className="text-xl font-bold">Property Performance</h2><p className="mt-1 text-sm text-[#604B4F]">Occupancy and student distribution</p></div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {filteredBlocks.map((block) => {
                const percent = Math.round((block.occupied / block.rooms) * 100);
                return (
                  <button type="button" key={block.name} onClick={() => setSearch(block.name)} className="rounded-2xl bg-[#F8EEDC] p-5 text-left transition hover:-translate-y-1">
                    <div className="flex items-center justify-between"><h3 className="font-bold">{block.name}</h3><Status status={block.status} /></div>
                    <p className="mt-4 text-2xl font-bold">{percent}%</p><p className="mt-1 text-xs text-[#604B4F]">{block.occupied} / {block.rooms} rooms • {block.students} students</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E3CFAD]"><div className="h-full rounded-full bg-[#5A1725]" style={{ width: `${percent}%` }} /></div>
                  </button>
                );
              })}
            </div>
          </section>}

          {activeSection === "students" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
                <div>
                  <h2 className="text-xl font-bold">Hostel resident directory</h2>
                  <p className="mt-1 text-sm text-[#604B4F]">Students grouped by their assigned block and room.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-3 py-2.5">
                    <Search size={16} className="text-[#604B4F]" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search hostel students" placeholder="Search students" className="w-40 bg-transparent text-sm outline-none" />
                  </label>
                  <span className="rounded-full bg-[#F3E8D0] px-3 py-2 text-sm font-bold text-[#5A1725]">{filteredStudents.length} students</span>
                </div>
              </div>
              {studentsError && <OwnerAlert message={studentsError} />}
              {studentsLoading ? <OwnerLoading /> : studentGroups.length ? (
                studentGroups.map(([block, members]) => (
                  <section key={block} className="overflow-hidden rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF]">
                    <div className="flex items-center justify-between border-b border-[#E3CFAD] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E8D0] text-[#5A1725]"><Building2 size={19} /></span>
                        <div><h3 className="font-bold">{block}</h3><p className="text-xs text-[#604B4F]">Hostel residents</p></div>
                      </div>
                      <span className="rounded-full bg-[#EAF3ED] px-3 py-1 text-xs font-bold text-[#28644B]">{members.length} students</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-[#E3CFAD] text-xs uppercase tracking-wide text-[#604B4F]">
                            <th className="px-5 py-3">Student</th>
                            <th className="px-4 py-3">Student ID</th>
                            <th className="px-4 py-3">Room</th>
                            <th className="px-4 py-3">Course / Year</th>
                            <th className="px-4 py-3">Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map((student) => (
                            <tr key={student._id} className="border-b border-[#E3CFAD]/60 last:border-0 hover:bg-[#F8EEDC]">
                              <td className="px-5 py-3.5"><p className="font-semibold">{student.fullName}</p><p className="mt-0.5 text-xs text-[#604B4F]">{student.email}</p></td>
                              <td className="px-4 py-3.5 font-mono text-xs">{student.studentId || "—"}</td>
                              <td className="px-4 py-3.5">{student.roomNumber || "Unassigned"}</td>
                              <td className="px-4 py-3.5">{[student.course, student.year && `Year ${student.year}`].filter(Boolean).join(" · ") || "—"}</td>
                              <td className="px-4 py-3.5">{student.phone || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))
              ) : (
                <OwnerEmptyState message={students.length ? "No students match your search." : "No active hostel students are registered yet."} />
              )}
            </section>
          )}

          {activeSection === "staff" && (
            <section className="space-y-5">
              <div className="overflow-hidden rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3CFAD] px-5 py-4">
                  <div>
                    <h2 className="text-xl font-bold">Staff directory & attendance</h2>
                    <p className="mt-1 text-sm text-[#604B4F]">Responsibilities and attendance for the selected date.</p>
                  </div>
                  <button type="button" onClick={() => setStaffFormOpen((open) => !open)} className="inline-flex items-center gap-2 rounded-xl bg-[#5A1725] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#7A2638]">
                    <UserPlus size={17} /> {staffFormOpen ? "Close form" : "Add staff"}
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-3">
                      <CalendarDays size={16} className="text-[#604B4F]" />
                      <span className="sr-only">Staff attendance date</span>
                      <input
                        type="date"
                        value={staffDate}
                        onChange={(event) => {
                          if (event.target.value && event.target.value !== staffDate) {
                            setStaffLoading(true);
                            setStaffError("");
                            setStaffDate(event.target.value);
                          }
                        }}
                        aria-label="Staff attendance date"
                        className="bg-transparent text-sm outline-none"
                      />
                    </label>
                    <button type="button" onClick={markAllStaffPresent} disabled={!staff.length || staffLoading || staffSaving} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#E3CFAD] px-3 text-sm font-bold text-[#5A1725] disabled:opacity-50">
                      <CheckSquare size={16} /> Mark all present
                    </button>
                    <button type="button" onClick={saveStaffAttendance} disabled={!staff.length || staffLoading || staffSaving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#5A1725] px-3 text-sm font-bold text-white disabled:opacity-50">
                      <Check size={16} /> {staffSaving ? "Saving..." : "Save attendance"}
                    </button>
                  </div>
                  <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-3">
                    <Search size={16} className="text-[#604B4F]" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search staff directory" placeholder="Search staff" className="w-36 bg-transparent text-sm outline-none" />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 px-5 pb-5 text-xs font-semibold">
                  <StaffCount label="Present" value={staffCounts.Present} tone="green" />
                  <StaffCount label="Absent" value={staffCounts.Absent} tone="red" />
                  <StaffCount label="Leave" value={staffCounts.Leave} tone="gold" />
                  <StaffCount label="Not marked" value={staffCounts["Not Marked"]} tone="gray" />
                </div>
              </div>

              {staffError && <OwnerAlert message={staffError} />}
              {staffSuccess && <div role="status" className="rounded-xl border border-[#28644B]/20 bg-[#EAF3ED] px-4 py-3 text-sm font-semibold text-[#28644B]">{staffSuccess}</div>}

              {staffFormOpen && (
                <form onSubmit={createStaff} className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-5">
                  <h3 className="text-lg font-bold">New staff record</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <label className="text-sm font-semibold">Full name<input name="fullName" required maxLength="100" className="form-control mt-2" /></label>
                    <label className="text-sm font-semibold">Staff ID<input name="staffId" required maxLength="30" placeholder="e.g. STF-001" className="form-control mt-2" /></label>
                    <label className="text-sm font-semibold">Department
                      <select name="department" required className="form-control mt-2">
                        {staffDepartments.map((department) => <option key={department}>{department}</option>)}
                      </select>
                    </label>
                    <label className="text-sm font-semibold xl:col-span-2">Assigned work<input name="assignedWork" required maxLength="200" placeholder="Describe their regular responsibility" className="form-control mt-2" /></label>
                    <label className="text-sm font-semibold">Email (optional)<input name="email" type="email" className="form-control mt-2" /></label>
                    <label className="text-sm font-semibold">Phone (optional)<input name="phone" type="tel" className="form-control mt-2" /></label>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button type="submit" disabled={staffCreating} className="rounded-xl bg-[#5A1725] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                      {staffCreating ? "Adding..." : "Add staff member"}
                    </button>
                  </div>
                </form>
              )}

              {staffLoading ? <OwnerLoading /> : filteredStaff.length ? (
                <div className="overflow-hidden rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#E3CFAD] text-xs uppercase tracking-wide text-[#604B4F]">
                          <th className="px-5 py-3">Staff member</th>
                          <th className="px-4 py-3">Department</th>
                          <th className="px-4 py-3">Assigned work</th>
                          <th className="px-4 py-3">Contact</th>
                          <th className="px-4 py-3">Attendance · {staffDate}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaff.map((member) => (
                          <tr key={member._id} className="border-b border-[#E3CFAD]/60 last:border-0">
                            <td className="px-5 py-4"><p className="font-bold">{member.fullName}</p><p className="mt-1 font-mono text-xs text-[#604B4F]">{member.staffId}</p></td>
                            <td className="px-4 py-4"><span className="rounded-full bg-[#F3E8D0] px-3 py-1 text-xs font-bold text-[#5A1725]">{member.department}</span></td>
                            <td className="px-4 py-4">
                              {workEdit?.staffId === member._id ? (
                                <form onSubmit={saveStaffWork} className="flex min-w-64 items-center gap-2">
                                  <input name="assignedWork" required maxLength="200" defaultValue={member.assignedWork} aria-label={`Assigned work for ${member.fullName}`} className="form-control py-2" />
                                  <button type="submit" className="rounded-lg bg-[#28644B] px-3 py-2 text-xs font-bold text-white">Save</button>
                                  <button type="button" onClick={() => setWorkEdit(null)} className="rounded-lg border border-[#E3CFAD] px-3 py-2 text-xs font-bold">Cancel</button>
                                </form>
                              ) : (
                                <div className="flex min-w-56 items-start justify-between gap-3">
                                  <span>{member.assignedWork}</span>
                                  <button type="button" onClick={() => setWorkEdit({ staffId: member._id })} className="shrink-0 text-xs font-bold text-[#5A1725] hover:underline">Edit</button>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4 text-xs text-[#604B4F]">{member.email || "—"}<br />{member.phone || ""}</td>
                            <td className="px-4 py-4">
                              <select aria-label={`Attendance for ${member.fullName}`} value={member.attendanceStatus} onChange={(event) => updateStaffAttendance(member._id, event.target.value)} className="form-control min-w-32 py-2">
                                {["Not Marked", "Present", "Absent", "Leave"].map((status) => <option key={status}>{status}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <OwnerEmptyState message={staff.length ? "No staff match your search." : "No staff records yet. Add a staff member to begin tracking assigned work and attendance."} />
              )}
            </section>
          )}

          {activeSection === "expenses" && <section className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
            <div><h2 className="text-xl font-bold">Expense Requests</h2><p className="mt-1 text-sm text-[#604B4F]">Review property maintenance approvals</p></div>
            <div className="mt-5 space-y-3">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#F8EEDC] p-4">
                  <div className="rounded-xl bg-[#5A1725] p-3 text-white"><Wrench size={18} /></div>
                  <div className="flex-1"><p className="font-semibold">{expense.title}</p><p className="mt-1 text-xs text-[#604B4F]">{expense.block}</p></div>
                  <p className="font-bold">{expense.amount}</p><Status status={expense.status} />
                  {expense.status === "Pending" && <button type="button" onClick={() => approveExpense(expense.id)} className="rounded-xl bg-[#28644B] px-4 py-2 text-xs font-bold text-white">Approve</button>}
                </div>
              ))}
              {filteredExpenses.length === 0 && <p className="py-8 text-center text-sm text-[#604B4F]">No matching expenses.</p>}
            </div>
          </section>}
        </main>
      </div>

      {profileModalOpen && (
        <div role="dialog" aria-modal="true" aria-label="Edit profile" className="fixed inset-0 z-[60] flex items-center justify-center bg-[#241719]/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && setProfileModalOpen(false)}>
          <form onSubmit={saveProfile} className="w-full max-w-md rounded-[28px] bg-[#FFF9EF] p-6">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <label className="mt-5 block text-sm font-semibold">Full name<input name="name" required defaultValue={user?.name || "Demo Owner"} className="form-control mt-2" /></label>
            <label className="mt-4 block text-sm font-semibold">Email<input name="email" required type="email" defaultValue={user?.email || "owner@demo.com"} className="form-control mt-2" /></label>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setProfileModalOpen(false)} className="rounded-xl border border-[#E3CFAD] px-4 py-2.5 text-sm font-bold">Cancel</button><button type="submit" className="rounded-xl bg-[#5A1725] px-4 py-2.5 text-sm font-bold text-white">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function OwnerMetric({ label, value, detail, icon: Icon }) {
  return (
    <div className="rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-[#604B4F]">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-[#28644B]">{detail}</p></div><div className="rounded-xl bg-[#F3E8D0] p-3 text-[#5A1725]"><Icon size={21} /></div></div></div>
  );
}

function OwnerAlert({ message }) {
  return <div role="alert" className="rounded-xl border border-[#9B2C2C]/20 bg-[#FBEAEA] px-4 py-3 text-sm text-[#9B2C2C]">{message}</div>;
}

function OwnerLoading() {
  return <div className="rounded-2xl border border-[#E3CFAD] bg-[#FFF9EF] py-12 text-center text-sm font-semibold text-[#604B4F]">Loading records...</div>;
}

function OwnerEmptyState({ message }) {
  return <div className="rounded-[26px] border border-dashed border-[#CDBB9D] bg-[#FFF9EF] px-6 py-12 text-center text-sm text-[#604B4F]">{message}</div>;
}

function StaffCount({ label, value, tone }) {
  const tones = {
    green: "bg-[#EAF3ED] text-[#28644B]",
    red: "bg-[#FBEAEA] text-[#9B2C2C]",
    gold: "bg-[#FFF2D6] text-[#9A6916]",
    gray: "bg-[#F3E8D0] text-[#604B4F]",
  };
  return <span className={`rounded-full px-3 py-1.5 ${tones[tone]}`}>{label}: {value}</span>;
}

function Status({ status }) {
  const styles = status === "Approved" || status === "Healthy" ? "bg-[#EAF3ED] text-[#28644B]" : status === "Attention" ? "bg-[#FFF2D6] text-[#9A6916]" : "bg-[#FFF2D6] text-[#9A6916]";
  return <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${styles}`}>{status}</span>;
}

export default OwnerDashboard;