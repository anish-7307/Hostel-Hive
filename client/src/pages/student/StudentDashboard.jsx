import {
  AlertCircle,
  ArrowRight,
  BedDouble,
  Bell,
  CalendarCheck,
  ChevronRight,
  CreditCard,
  FileText,
  IndianRupee,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { apiRequest } from "../../lib/api";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");

  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const stats = [
    {
      title: "My Room",
      value: user?.roomNumber || "Not assigned",
      subtitle: user?.block ? `${user.block} block` : "View your room details",
      icon: BedDouble,
      to: "/student/room",
    },
    {
      title: "Attendance",
      value: "View register",
      subtitle: "Check your attendance records",
      icon: CalendarCheck,
      to: "/student/attendance",
    },
    {
      title: "Fees & Payments",
      value: "View details",
      subtitle: "Review your fee information",
      icon: CreditCard,
      to: "/student/fees",
    },
    {
      title: "Complaints",
      value: "Track requests",
      subtitle: "See updates on reported issues",
      icon: MessageSquare,
      to: "/student/complaints",
    },
  ];

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest("/student/leave-requests"),
      apiRequest("/student/complaints"),
    ])
      .then(([leaveResult, complaintResult]) => {
        if (!active) return;
        const activity = [
          ...leaveResult.data.map((item) => ({
            id: `leave-${item._id}`,
            title: `${item.leaveType} leave request`,
            date: item.createdAt,
            status: item.status,
            type: "Leave",
            to: "/student/leave",
          })),
          ...complaintResult.data.map((item) => ({
            id: `complaint-${item._id}`,
            title: item.title,
            date: item.createdAt,
            status: item.status,
            type: "Complaint",
            to: "/student/complaints",
          })),
        ];
        setRecentActivity(activity.sort((first, second) => new Date(second.date) - new Date(first.date)).slice(0, 4));
      })
      .catch((requestError) => {
        if (active) setActivityError(requestError.message);
      })
      .finally(() => {
        if (active) setActivityLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#F3E8D0] text-[#241719]">
      {/* Top Bar */}
      <header className="border-b border-[#E3CFAD] bg-[#FFF9EF]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <p className="text-sm font-medium text-[#7A2638]">
              Student Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting}, {firstName}
            </h1>
          </div>

          <button
            onClick={() => navigate("/student/notifications")}
            className="relative rounded-2xl border border-[#E3CFAD] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Notifications"
          >
            <Bell size={21} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 lg:px-8">
        {/* Welcome Card */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#5A1725] via-[#6B1E2E] to-[#3D0D18] p-7 text-[#FFF9EF] shadow-[0_25px_60px_rgba(90,23,37,0.25)] sm:p-9">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#E3CFAD]">
              Hostel Hive Student Portal
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything about your hostel, in one place.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-[#F3E8D0]">
              Check your room, attendance, fee information, and request updates from your student dashboard.
            </p>
          </div>

          {/* 3D decorative shapes */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#C69C5A]/20 blur-sm" />

          <div className="absolute -bottom-20 right-20 h-44 w-44 rounded-full border border-[#C69C5A]/20 bg-[#FFF9EF]/5 backdrop-blur-sm" />

          <div className="absolute right-10 top-10 hidden h-20 w-20 rotate-12 rounded-2xl border border-white/10 bg-white/5 lg:block" />
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Overview</h2>
            <p className="text-sm text-[#604B4F]">
              Your current hostel information
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <button
                  key={stat.title}
                  type="button"
                  onClick={() => navigate(stat.to)}
                  className="card-3d rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-5 shadow-[0_12px_30px_rgba(90,23,37,0.08)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl bg-[#F3E8D0] p-3 text-[#5A1725]">
                      <Icon size={22} />
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-[#604B4F]"
                    />
                  </div>

                  <p className="mt-5 text-sm font-medium text-[#604B4F]">
                    {stat.title}
                  </p>

                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>

                  <p className="mt-1 text-xs text-[#604B4F]">
                    {stat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Recent activity */}
          <div className="card-3d lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6 shadow-[0_12px_30px_rgba(90,23,37,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Recent activity</h2>
                <p className="mt-1 text-sm text-[#604B4F]">
                  Your latest leave requests and complaints
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/student/leave")}
                className="flex items-center gap-1 text-sm font-semibold text-[#7A2638]"
              >
                View requests
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {activityError && <p role="alert" className="rounded-2xl border border-[#9B2C2C]/20 bg-[#FBEAEA] p-4 text-sm text-[#9B2C2C]">{activityError}</p>}
              {activityLoading ? (
                <p className="rounded-2xl bg-[#F8EEDC] p-5 text-sm text-[#604B4F]" role="status">Loading your recent requests...</p>
              ) : recentActivity.length ? recentActivity.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigate(item.to)}
                  className="flex items-center gap-4 rounded-2xl border border-[#E3CFAD]/70 bg-[#F8EEDC] p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="rounded-xl bg-[#5A1725] p-3 text-[#FFF9EF]">
                    {item.type === "Complaint" ? <MessageSquare size={19} /> : <FileText size={19} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{item.title}</h3>
                    <p className="mt-1 text-xs text-[#604B4F]">{item.type} · {item.status || "Submitted"} · {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(item.date))}</p>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-[#604B4F]"
                  />
                </button>
              )) : !activityError && (
                <div className="rounded-2xl border border-dashed border-[#E3CFAD] bg-[#F8EEDC]/70 p-6 text-center">
                  <p className="font-semibold">You’re all caught up</p>
                  <p className="mt-1 text-sm text-[#604B4F]">Your submitted requests will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance */}
          <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6 shadow-[0_12px_30px_rgba(90,23,37,0.08)]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#F3E8D0] p-3 text-[#5A1725]">
                <CalendarCheck size={21} />
              </div>

              <div>
                <h2 className="font-bold">Attendance register</h2>
                <p className="text-xs text-[#604B4F]">
                  View recorded attendance
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-[#604B4F]">
              Open your monthly register to review attendance recorded by your warden.
            </p>
            <button type="button" onClick={() => navigate("/student/attendance")} className="mt-5 inline-flex w-full items-center justify-between rounded-2xl bg-[#F8EEDC] px-4 py-3 text-sm font-bold text-[#5A1725] transition hover:bg-[#F3E8D0]">
              Open attendance <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* Bottom Cards */}
        <section className="grid gap-6 md:grid-cols-3">
          <QuickAction
            icon={IndianRupee}
            title="Pay Hostel Fees"
            description="View your fee breakdown and payments."
            to="/student/fees"
          />

          <QuickAction
            icon={AlertCircle}
            title="Report a Complaint"
            description="Report maintenance or hostel issues."
            to="/student/complaints"
          />

          <QuickAction
            icon={CalendarCheck}
            title="Apply for Leave"
            description="Submit and track your leave requests."
            to="/student/leave"
          />
        </section>
      </main>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description, to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="card-3d group rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-5 text-left shadow-[0_12px_30px_rgba(90,23,37,0.08)]"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-[#5A1725] p-3 text-[#FFF9EF] transition group-hover:scale-105">
          <Icon size={21} />
        </div>

        <ArrowRight
          size={19}
          className="text-[#604B4F] transition group-hover:translate-x-1"
        />
      </div>

      <h3 className="mt-5 font-bold">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-[#604B4F]">
        {description}
      </p>
    </button>
  );
}

export default StudentDashboard;