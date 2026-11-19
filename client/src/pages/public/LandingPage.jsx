import {
  ArrowRight,
  BedDouble,
  Bell,
  CalendarCheck,
  ClipboardCheck,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: BedDouble,
    title: "Resident life",
    description: "Find room details, attendance, fee information, and hostel updates in one place.",
  },
  {
    icon: CalendarCheck,
    title: "Everyday requests",
    description: "Submit leave applications, register visitors, and follow up on hostel concerns.",
  },
  {
    icon: ClipboardCheck,
    title: "Warden operations",
    description: "Keep student records, attendance, leave requests, and complaints organized.",
  },
  {
    icon: Users,
    title: "Owner oversight",
    description: "Review hostel occupancy, staff responsibilities, revenue, and expenses.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FFF9EF] text-[#241719]">
      <header className="relative z-10 border-b border-[#E3CFAD]/70 bg-[#FFF9EF]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8" aria-label="Main navigation">
          <Link to="/" className="flex items-center gap-3 rounded-xl" aria-label="Hostel Hive home">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5A1725] text-sm font-black text-[#FFF9EF] shadow-[0_8px_20px_rgba(90,23,37,0.2)]">HH</span>
            <span>
              <span className="block font-bold">Hostel Hive</span>
              <span className="block text-xs text-[#604B4F]">Hostel life, in sync</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-[#5A1725] transition hover:bg-[#F3E8D0] sm:inline-flex">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#5A1725] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(90,23,37,0.2)] transition hover:-translate-y-0.5 hover:bg-[#7A2638]">
              Student sign up <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-20 -z-10 h-[520px] w-[520px] rounded-full bg-[#E3CFAD]/35 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E3CFAD] bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7A2638]">
                <ShieldCheck size={15} /> One connected hostel platform
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-[#3D0D18] sm:text-5xl lg:text-6xl">
                A better way to live, manage, and grow together.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#604B4F] sm:text-lg">
                Hostel Hive brings residents, wardens, and owners together with the tools to keep everyday hostel life running smoothly.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-[#5A1725] px-6 py-3.5 font-bold text-white shadow-[0_12px_28px_rgba(90,23,37,0.2)] transition hover:-translate-y-0.5 hover:bg-[#7A2638]">
                  Open your portal <ArrowRight size={18} />
                </Link>
                <a href="#features" className="rounded-2xl border border-[#E3CFAD] bg-white/80 px-6 py-3.5 font-bold text-[#5A1725] transition hover:bg-[#F8EEDC]">
                  Explore features
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#604B4F]">
                <span className="inline-flex items-center gap-2"><Users size={16} className="text-[#7A2638]" /> Three role-based portals</span>
                <span className="inline-flex items-center gap-2"><Bell size={16} className="text-[#7A2638]" /> Updates in one place</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div aria-hidden="true" className="absolute -left-8 -top-8 h-28 w-28 rounded-[30px] border border-[#C69C5A]/40 bg-[#F3E8D0]/70 rotate-[-12deg]" />
              <div className="relative rounded-[30px] border border-[#E3CFAD] bg-white p-4 shadow-[0_32px_80px_rgba(61,13,24,0.16)] sm:p-6">
                <div className="flex items-center justify-between border-b border-[#F3E8D0] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A1725] text-xs font-black text-white">HH</span>
                    <div><p className="text-sm font-bold">Your hostel, at a glance</p><p className="text-xs text-[#604B4F]">A simpler daily overview</p></div>
                  </div>
                  <span className="rounded-full bg-[#EAF3ED] px-3 py-1 text-xs font-bold text-[#28644B]">All in one place</span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-5">
                  {[
                    [BedDouble, "Room details", "Stay informed"],
                    [CalendarCheck, "Attendance", "Keep track"],
                    [CreditCard, "Fee information", "Know what's due"],
                    [ClipboardCheck, "Requests", "Follow progress"],
                  ].map(([Icon, title, detail]) => (
                    <div key={title} className="rounded-2xl border border-[#E3CFAD]/70 bg-[#FFF9EF] p-4">
                      <span className="inline-flex rounded-xl bg-[#F3E8D0] p-2.5 text-[#5A1725]"><Icon size={18} /></span>
                      <p className="mt-3 text-sm font-bold">{title}</p>
                      <p className="mt-1 text-xs text-[#604B4F]">{detail}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#3D0D18] px-4 py-3.5 text-[#FFF9EF]">
                  <span className="rounded-xl bg-white/10 p-2"><ShieldCheck size={18} /></span>
                  <div><p className="text-sm font-bold">The right tools for every role</p><p className="mt-0.5 text-xs text-[#F3E8D0]/75">Resident · Warden · Owner</p></div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute -bottom-8 -right-7 -z-10 h-40 w-40 rounded-full bg-[#C69C5A]/20 blur-2xl" />
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-[#E3CFAD]/70 bg-[#F8EEDC]/60">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9A6916]">Made for hostel life</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#3D0D18] sm:text-4xl">Less chasing. More clarity.</h2>
              <p className="mt-4 leading-7 text-[#604B4F]">Bring the everyday tasks of your hostel into a straightforward, connected experience.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-5 shadow-[0_8px_24px_rgba(90,23,37,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(90,23,37,0.1)]">
                  <span className="inline-flex rounded-2xl bg-[#F3E8D0] p-3 text-[#5A1725]"><Icon size={21} /></span>
                  <h3 className="mt-5 font-bold text-[#3D0D18]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#604B4F]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-[#3D0D18] sm:text-3xl">Ready to get started?</h2>
            <p className="mt-2 text-[#604B4F]">Sign in to continue to your Hostel Hive portal.</p>
          </div>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-[#5A1725] px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#7A2638]">
            Sign in to Hostel Hive <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#E3CFAD]/70 bg-[#F8EEDC]/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-[#604B4F] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p><span className="font-bold text-[#5A1725]">Hostel Hive</span> · Hostel life, in sync.</p>
          <Link to="/login" className="font-semibold text-[#5A1725] hover:underline">Access your account</Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
