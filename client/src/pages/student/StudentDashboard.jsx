import {
  AlertCircle,
  ArrowRight,
  BedDouble,
  Bell,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  IndianRupee,
  MessageSquare,
} from "lucide-react";

const stats = [
  {
    title: "My Room",
    value: "A-204",
    subtitle: "2 / 3 beds occupied",
    icon: BedDouble,
  },
  {
    title: "Attendance",
    value: "86%",
    subtitle: "Good standing",
    icon: CalendarCheck,
  },
  {
    title: "Fees Due",
    value: "₹12,000",
    subtitle: "Next due: 10 Nov",
    icon: CreditCard,
  },
  {
    title: "Complaints",
    value: "2",
    subtitle: "1 in progress",
    icon: MessageSquare,
  },
];

const notices = [
  {
    title: "Hostel maintenance scheduled",
    date: "26 Oct 2026",
    type: "Maintenance",
  },
  {
    title: "Mess feedback form is now open",
    date: "25 Oct 2026",
    type: "Mess",
  },
  {
    title: "Monthly attendance has been updated",
    date: "24 Oct 2026",
    type: "Attendance",
  },
];

function StudentDashboard() {
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
              Good morning, Anish 👋
            </h1>
          </div>

          <button
            className="relative rounded-2xl border border-[#E3CFAD] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Notifications"
          >
            <Bell size={21} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#7A2638]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 lg:px-8">
        {/* Welcome Card */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#5A1725] via-[#6B1E2E] to-[#3D0D18] p-7 text-[#FFF9EF] shadow-[0_25px_60px_rgba(90,23,37,0.25)] sm:p-9">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#E3CFAD]">
              Hostel Management System
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything about your hostel, in one place.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-[#F3E8D0]">
              Check your room, attendance, fees, complaints, notices and
              hostel activities from your student dashboard.
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
                <div
                  key={stat.title}
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
                </div>
              );
            })}
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Notices */}
          <div className="card-3d lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6 shadow-[0_12px_30px_rgba(90,23,37,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Latest Notices</h2>
                <p className="mt-1 text-sm text-[#604B4F]">
                  Important hostel announcements
                </p>
              </div>

              <button className="flex items-center gap-1 text-sm font-semibold text-[#7A2638]">
                View all
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.title}
                  className="flex items-center gap-4 rounded-2xl border border-[#E3CFAD]/70 bg-[#F8EEDC] p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="rounded-xl bg-[#5A1725] p-3 text-[#FFF9EF]">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">
                      {notice.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#604B4F]">
                      {notice.type} • {notice.date}
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-[#604B4F]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Attendance */}
          <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6 shadow-[0_12px_30px_rgba(90,23,37,0.08)]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF3ED] p-3 text-[#28644B]">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <h2 className="font-bold">Attendance Status</h2>
                <p className="text-xs text-[#604B4F]">
                  This month's summary
                </p>
              </div>
            </div>

            <div className="mt-7 flex justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-[#E3CFAD]">
                <div className="absolute inset-[-14px] rounded-full border-[14px] border-transparent border-l-[#5A1725] border-t-[#5A1725] border-r-[#7A2638]" />

                <div className="text-center">
                  <p className="text-3xl font-bold">86%</p>
                  <p className="text-xs text-[#604B4F]">Present</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#F8EEDC] p-4 text-center">
              <p className="text-sm font-semibold text-[#28644B]">
                Attendance is above 75%
              </p>

              <p className="mt-1 text-xs text-[#604B4F]">
                Keep maintaining your attendance.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Cards */}
        <section className="grid gap-6 md:grid-cols-3">
          <QuickAction
            icon={IndianRupee}
            title="Pay Hostel Fees"
            description="View your fee breakdown and payments."
          />

          <QuickAction
            icon={AlertCircle}
            title="Report a Complaint"
            description="Report maintenance or hostel issues."
          />

          <QuickAction
            icon={CalendarCheck}
            title="Apply for Leave"
            description="Submit and track your leave requests."
          />
        </section>
      </main>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description }) {
  return (
    <button className="card-3d group rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-5 text-left shadow-[0_12px_30px_rgba(90,23,37,0.08)]">
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