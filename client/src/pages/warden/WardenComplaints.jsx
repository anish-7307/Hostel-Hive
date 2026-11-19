import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { apiRequest } from "../../lib/api";
import { ApiError, Loading, PageHeading } from "./WardenStudents";

function WardenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/warden/complaints")
      .then((result) => {
        if (active) setComplaints(result.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError("");
    try {
      const result = await apiRequest(`/warden/complaints/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setComplaints((current) => current.map((complaint) => complaint._id === id ? result.data : complaint));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId("");
    }
  };

  const filtered = useMemo(() => complaints.filter((complaint) => {
    const student = complaint.student || {};
    const matchesText = `${complaint.ticket} ${complaint.title} ${complaint.category} ${student.fullName || ""} ${student.studentId || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesText && (statusFilter === "All" || complaint.status === statusFilter);
  }), [complaints, search, statusFilter]);

  const openCount = complaints.filter((complaint) => ["Open", "In Progress"].includes(complaint.status)).length;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 lg:px-8">
      <PageHeading title="Complaints" subtitle="Review service issues and keep students informed as you resolve them" count={`${openCount} open`} />
      <section className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-3 py-2.5">
            <Search size={17} className="text-[#604B4F]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search complaints" placeholder="Search ticket, title or student" className="w-56 bg-transparent text-sm outline-none" />
          </label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter complaints by status" className="form-control w-auto">
            {["All", "Open", "In Progress", "Resolved", "Rejected"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
        {error && <ApiError message={error} />}
        {loading ? <Loading /> : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((complaint) => (
              <article key={complaint._id} className="rounded-2xl bg-[#F8EEDC] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-xs font-bold text-[#604B4F]">{complaint.ticket}</p><h2 className="mt-1 text-lg font-bold">{complaint.title}</h2></div>
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="mt-2 text-sm text-[#604B4F]">{complaint.category} • {complaint.priority} priority</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{complaint.description}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3CFAD] pt-4">
                  <div><p className="text-sm font-semibold">{complaint.student?.fullName || "Student"}</p><p className="text-xs text-[#604B4F]">{complaint.student?.studentId || complaint.student?.email || ""} • {new Date(complaint.createdAt).toLocaleDateString()}</p></div>
                  {complaint.status !== "Resolved" && complaint.status !== "Rejected" && (
                    <select
                      aria-label={`Update status for ${complaint.ticket}`}
                      value={complaint.status}
                      disabled={updatingId === complaint._id}
                      onChange={(event) => updateStatus(complaint._id, event.target.value)}
                      className="form-control w-auto"
                    >
                      {["Open", "In Progress", "Resolved", "Rejected"].map((status) => <option key={status}>{status}</option>)}
                    </select>
                  )}
                </div>
              </article>
            ))}
            {!filtered.length && !error && <p className="py-12 text-center text-sm text-[#604B4F] lg:col-span-2">{complaints.length ? "No complaints match these filters." : "No complaints have been submitted."}</p>}
          </div>
        )}
      </section>
    </main>
  );
}

function StatusBadge({ status }) {
  const color = status === "Resolved" ? "bg-[#EAF3ED] text-[#28644B]" : status === "Rejected" ? "bg-[#FBEAEA] text-[#9B2C2C]" : status === "In Progress" ? "bg-[#EDF3F7] text-[#315D78]" : "bg-[#FFF2D6] text-[#9A6916]";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{status}</span>;
}

export default WardenComplaints;
