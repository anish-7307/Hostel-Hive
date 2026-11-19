import { useEffect, useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { apiRequest } from "../../lib/api";
import { ApiError, Loading, PageHeading } from "./WardenStudents";

function WardenLeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/warden/leave-requests")
      .then((result) => {
        if (active) setRequests(result.data);
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
      const result = await apiRequest(`/warden/leave-requests/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setRequests((current) => current.map((request) => request._id === id ? result.data : request));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId("");
    }
  };

  const filtered = useMemo(() => requests.filter((request) => {
    const student = request.student || {};
    const matchesText = `${student.fullName || ""} ${student.studentId || ""} ${request.leaveType} ${request.reason}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesText && (statusFilter === "All" || request.status === statusFilter);
  }), [requests, search, statusFilter]);

  const pendingCount = requests.filter((request) => request.status === "Pending").length;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 lg:px-8">
      <PageHeading title="Leave Requests" subtitle="Review student leave applications and record your decision" count={`${pendingCount} pending`} />
      <section className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-3 py-2.5">
            <Search size={17} className="text-[#604B4F]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search leave requests" placeholder="Search student or reason" className="w-52 bg-transparent text-sm outline-none" />
          </label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter leave requests by status" className="form-control w-auto">
            {["All", "Pending", "Approved", "Rejected"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
        {error && <ApiError message={error} />}
        {loading ? <Loading /> : (
          <div className="space-y-3">
            {filtered.map((request) => (
              <article key={request._id} className="rounded-2xl bg-[#F8EEDC] p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="min-w-52 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold">{request.student?.fullName || "Student"}</h2>
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">{request.student?.studentId || "No ID"}</span>
                      <StatusBadge status={request.status} />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#5A1725]">{request.leaveType}</p>
                    <p className="mt-1 text-sm text-[#604B4F]">{formatDate(request.fromDate)} - {formatDate(request.toDate)} • Contact: {request.contact}</p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{request.reason}</p>
                    <p className="mt-3 text-xs text-[#604B4F]">Submitted {formatDateTime(request.createdAt)}{request.reviewedBy?.fullName ? ` • Reviewed by ${request.reviewedBy.fullName}` : ""}</p>
                  </div>
                  {request.status === "Pending" && (
                    <div className="flex gap-2">
                      <button type="button" disabled={updatingId === request._id} onClick={() => updateStatus(request._id, "Approved")} className="inline-flex items-center gap-1 rounded-xl bg-[#28644B] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Check size={15} /> Approve</button>
                      <button type="button" disabled={updatingId === request._id} onClick={() => updateStatus(request._id, "Rejected")} className="inline-flex items-center gap-1 rounded-xl bg-[#9B2C2C] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><X size={15} /> Reject</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
            {!filtered.length && !error && <p className="py-12 text-center text-sm text-[#604B4F]">{requests.length ? "No requests match these filters." : "No leave requests have been submitted."}</p>}
          </div>
        )}
      </section>
    </main>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString() : "—";
}

function StatusBadge({ status }) {
  const color = status === "Approved" ? "bg-[#EAF3ED] text-[#28644B]" : status === "Rejected" ? "bg-[#FBEAEA] text-[#9B2C2C]" : "bg-[#FFF2D6] text-[#9A6916]";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{status}</span>;
}

export default WardenLeaveRequests;
