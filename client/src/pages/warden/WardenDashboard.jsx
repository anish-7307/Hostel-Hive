import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { apiRequest } from "../../lib/api";
import { ApiError, Loading } from "./WardenStudents";

function WardenDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/warden/dashboard")
      .then((result) => {
        if (active) setDashboard(result.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 lg:px-8">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#5A1725] to-[#3D0D18] p-7 text-[#FFF9EF] sm:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C69C5A]">Warden Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold">Good morning, {user?.name || "Warden"} 👋</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#F3E8D0]/80">Hostel operations overview. Review student records, leave applications and complaints from one place.</p>
      </section>

      {error && <ApiError message={error} />}
      {loading ? <Loading /> : dashboard && (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total Students" value={dashboard.totalStudents} detail={`${dashboard.activeStudents} active accounts`} icon={Users} />
          <Metric label="Pending Leave" value={dashboard.pendingLeaves} detail="Awaiting review" icon={CalendarCheck} />
          <Metric label="Open Complaints" value={dashboard.openComplaints} detail="Open or being resolved" icon={MessageSquare} />
          <Metric label="Assigned Rooms" value={dashboard.assignedRooms} detail="Based on student allocations" icon={BedDouble} />
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        <ActionCard
          title="Student Directory"
          description="Look up registered students, IDs, contacts and course information."
          count={dashboard ? `${dashboard.totalStudents} records` : "View records"}
          icon={Users}
          to="/warden/students"
        />
        <ActionCard
          title="Leave Requests"
          description="Review applications, inspect dates and approve or reject requests."
          count={dashboard ? `${dashboard.pendingLeaves} pending` : "Review requests"}
          icon={CalendarCheck}
          to="/warden/leave-requests"
        />
        <ActionCard
          title="Complaints"
          description="Track reported hostel issues and update resolution status."
          count={dashboard ? `${dashboard.openComplaints} open` : "Track issues"}
          icon={ClipboardList}
          to="/warden/complaints"
        />
        <div className="rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-lg font-bold">Warden Checklist</h2>
          <div className="mt-4 space-y-3 text-sm text-[#604B4F]">
            <p className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[#C69C5A]" />Review new leave applications</p>
            <p className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[#7A2638]" />Follow up on unresolved complaints</p>
            <p className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[#28644B]" />Keep student contact records current</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, detail, icon: Icon }) {
  return (
    <div className="rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-5">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-sm text-[#604B4F]">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-[#604B4F]">{detail}</p></div>
        <div className="rounded-xl bg-[#F3E8D0] p-3 text-[#5A1725]"><Icon size={21} /></div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, count, icon: Icon, to }) {
  return (
    <Link to={to} className="card-3d rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-xl bg-[#5A1725] p-3 text-white"><Icon size={21} /></div>
        <ArrowRight size={19} className="text-[#604B4F]" />
      </div>
      <h2 className="mt-5 text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#604B4F]">{description}</p>
      <p className="mt-4 text-sm font-bold text-[#7A2638]">{count}</p>
    </Link>
  );
}

export default WardenDashboard;
