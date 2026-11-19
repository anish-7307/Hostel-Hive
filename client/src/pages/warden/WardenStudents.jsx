import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { apiRequest } from "../../lib/api";

function WardenStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/warden/students")
      .then((result) => {
        if (active) setStudents(result.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => students.filter((student) =>
    `${student.fullName} ${student.studentId || ""} ${student.email} ${student.course || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ), [students, search]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 lg:px-8">
      <PageHeading title="Students" subtitle="Browse and search registered hostel students" count={`${students.length} students`} />
      <section className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Student Directory</h2>
          <label className="flex items-center gap-2 rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-3 py-2.5">
            <Search size={17} className="text-[#604B4F]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search students" placeholder="Name, ID, email or course" className="w-56 bg-transparent text-sm outline-none" />
          </label>
        </div>

        {error && <ApiError message={error} />}
        {loading ? <Loading /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead><tr className="border-b border-[#E3CFAD] text-xs uppercase tracking-wide text-[#604B4F]"><th className="px-3 py-3">Student</th><th className="px-3 py-3">Student ID</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Course / Year</th><th className="px-3 py-3">Room</th><th className="px-3 py-3">Status</th></tr></thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student._id} className="border-b border-[#E3CFAD]/70 last:border-0">
                    <td className="px-3 py-4"><p className="font-bold">{student.fullName}</p><p className="mt-1 text-xs text-[#604B4F]">{student.email}</p></td>
                    <td className="px-3 py-4">{student.studentId || "—"}</td>
                    <td className="px-3 py-4">{student.phone || "—"}</td>
                    <td className="px-3 py-4">{[student.course, student.year].filter(Boolean).join(" • ") || "—"}</td>
                    <td className="px-3 py-4">{[student.block, student.roomNumber].filter(Boolean).join(" • ") || "—"}</td>
                    <td className="px-3 py-4"><StatusBadge active={student.isActive} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && !error && <p className="py-12 text-center text-sm text-[#604B4F]">{students.length ? "No students match your search." : "No student accounts have been registered yet."}</p>}
          </div>
        )}
      </section>
    </main>
  );
}

export function PageHeading({ title, subtitle, count }) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-[26px] bg-[#5A1725] p-6 text-[#FFF9EF] sm:p-8">
      <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C69C5A]">Warden Portal</p><h1 className="mt-2 text-3xl font-bold">{title}</h1><p className="mt-2 text-sm text-[#F3E8D0]/80">{subtitle}</p></div>
      {count && <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold"><Users size={17} /> {count}</span>}
    </section>
  );
}

export function ApiError({ message }) {
  return <div role="alert" className="mb-5 rounded-2xl border border-[#9B2C2C]/20 bg-[#FBEAEA] px-4 py-3 text-sm text-[#9B2C2C]">{message}</div>;
}

export function Loading() {
  return <div className="py-12 text-center text-sm font-semibold text-[#604B4F]">Loading records...</div>;
}

function StatusBadge({ active }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-[#EAF3ED] text-[#28644B]" : "bg-[#FBEAEA] text-[#9B2C2C]"}`}>{active ? "Active" : "Inactive"}</span>;
}

export default WardenStudents;
