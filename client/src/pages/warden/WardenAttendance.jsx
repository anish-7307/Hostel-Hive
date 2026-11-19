import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckSquare,
  FileSpreadsheet,
  Printer,
  Search,
  Users,
} from "lucide-react";
import { apiRequest } from "../../lib/api";
import { ApiError, Loading, PageHeading } from "./WardenStudents";

function getToday() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

function getYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const offset = yesterday.getTimezoneOffset();
  return new Date(yesterday.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

function WardenAttendance() {
  const navigate = useNavigate();
  const [date, setDate] = useState(getToday);
  const [matrixDays, setMatrixDays] = useState([]);
  const [matrixStudents, setMatrixStudents] = useState([]);
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [search, setSearch] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [success, setSuccess] = useState("");
  const [summaryReload, setSummaryReload] = useState(0);
  const selectedMonth = date.slice(0, 7);

  useEffect(() => {
    let active = true;
    apiRequest(`/warden/attendance/matrix?month=${encodeURIComponent(selectedMonth)}`)
      .then((result) => {
        if (active) {
          setMatrixDays(result.data.days);
          setMatrixStudents(result.data.students);
          setDaysElapsed(result.data.daysElapsed);
        }
      })
      .catch((requestError) => {
        if (active) setSummaryError(requestError.message);
      })
      .finally(() => {
        if (active) setSummaryLoading(false);
      });

    return () => { active = false; };
  }, [selectedMonth, summaryReload]);

  const selectDate = (nextDate) => {
    if (!nextDate || nextDate === date) return;
    setDate(nextDate);
    setSaveError("");
    setSuccess("");
    if (nextDate.slice(0, 7) !== selectedMonth) {
      setSummaryLoading(true);
      setSummaryError("");
    }
  };

  const filteredMatrixStudents = useMemo(() => matrixStudents.filter((student) =>
    `${student.fullName} ${student.studentId || ""} ${student.roomNumber || ""} ${student.block || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ), [matrixStudents, search]);

  const dayTotals = useMemo(() => matrixDays.map((day) => matrixStudents.reduce((totals, student) => {
    const status = student.attendance[day];
    if (status === "Present") totals.present += 1;
    if (status === "Absent") totals.absent += 1;
    if (status === "Leave") totals.leave += 1;
    return totals;
  }, { date: day, present: 0, absent: 0, leave: 0 })), [matrixDays, matrixStudents]);
  const monthlyTotals = useMemo(() => dayTotals.reduce((totals, day) => ({
    present: totals.present + day.present,
    absent: totals.absent + day.absent,
    leave: totals.leave + day.leave,
  }), { present: 0, absent: 0, leave: 0 }), [dayTotals]);
  const monthlyAttendanceCount = monthlyTotals.present + monthlyTotals.absent;
  const recordedCount = monthlyAttendanceCount + monthlyTotals.leave;

  const updateStudentStatus = (studentId, status) => {
    setSuccess("");
    setMatrixStudents((current) => current.map((student) => (
      student._id === studentId
        ? { ...student, attendance: { ...student.attendance, [date]: status } }
        : student
    )));
  };

  const markAllPresent = () => {
    setSuccess("");
    setMatrixStudents((current) => current.map((student) => (
      { ...student, attendance: { ...student.attendance, [date]: "Present" } }
    )));
  };

  const saveAttendance = async () => {
    if (!matrixStudents.length) {
      setSaveError("There are no students to save attendance for.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSuccess("");
    try {
      const entries = matrixStudents.map((student) => ({
        studentId: student._id,
        status: student.attendance[date] || "Not Marked",
      }));
      const result = await apiRequest("/warden/attendance", {
        method: "PUT",
        body: { date, entries },
      });
      setSuccess(`Attendance saved for ${formatDay(date)}: ${result.data.savedCount} marked, ${result.data.clearedCount} cleared.`);
      setSummaryReload((current) => current + 1);
    } catch (requestError) {
      setSaveError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const cycleStudentStatus = (studentId, status) => {
    const statuses = ["Not Marked", "Present", "Absent", "Leave"];
    updateStudentStatus(studentId, statuses[(statuses.indexOf(status) + 1) % statuses.length]);
  };

  const downloadBlankSheet = () => {
    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const headers = [
      "Roll No",
      "Id No",
      "Name",
      ...matrixDays.map((day) => Number(day.slice(-2))),
      "Total Days of Month",
      "Present of this Month",
      "Present Up to Last Month",
      "Absent Up to This Month",
      "Total Att.",
    ];
    const rows = matrixStudents.map((student, index) => [
      index + 1,
      student.studentId || "",
      student.fullName,
      ...matrixDays.map(() => ""),
      matrixDays.length,
      "",
      "",
      "",
      "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${selectedMonth}-blank.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 lg:px-8">
      <PageHeading
        title="Attendance"
        subtitle="Mark student attendance directly in the monthly sheet"
        count={`${matrixStudents.length} students`}
      />

      <div className="attendance-print-area space-y-5">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SheetMetric
            title="Active students"
            value={matrixStudents.length}
            detail="In the hostel roster"
            tone="blue"
            icon={Users}
          />
          <SheetMetric
            title="Recorded entries"
            value={recordedCount}
            detail={`${formatMonth(selectedMonth)}`}
            tone="violet"
            icon={FileSpreadsheet}
          />
          <SheetMetric
            title="Present"
            value={monthlyTotals.present}
            detail={`${monthlyTotals.leave} leave entries excluded`}
            tone="green"
            icon={Check}
          />
          <SheetMetric
            title="Absent"
            value={monthlyTotals.absent}
            detail="Recorded this month"
            tone="rose"
            icon={Users}
          />
        </section>

        <section className="no-print overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Attendance register</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{formatMonth(selectedMonth)}</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
              <CalendarDays size={14} /> Editing {formatDay(date)}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <label className="sheet-field">
                <span className="text-xs font-semibold text-slate-500">Month</span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(event) => {
                    if (event.target.value) selectDate(`${event.target.value}-01`);
                  }}
                  aria-label="Attendance month"
                  className="min-w-32 bg-transparent text-sm font-semibold text-slate-800 outline-none"
                />
              </label>
              <label className="sheet-field">
                <span className="text-xs font-semibold text-slate-500">Attendance date (past dates allowed)</span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => selectDate(event.target.value)}
                  aria-label="Selected attendance date"
                  className="bg-transparent text-sm font-semibold text-slate-800 outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => selectDate(getYesterday())}
                disabled={summaryLoading || saving}
                className="sheet-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
                title="Select yesterday to record or update past attendance"
              >
                <CalendarDays size={16} /> Yesterday
              </button>
              <button
                type="button"
                onClick={markAllPresent}
                disabled={!matrixStudents.length || summaryLoading || saving}
                className="sheet-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckSquare size={16} /> Mark all present
              </button>
              <button
                type="button"
                onClick={saveAttendance}
                disabled={!matrixStudents.length || summaryLoading || saving}
                className="sheet-button-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} /> {saving ? "Saving…" : "Save attendance"}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="sheet-search">
                <Search size={16} className="shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search attendance sheet"
                  placeholder="Search students"
                  className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                {search && <span className="text-xs tabular-nums text-slate-500">{filteredMatrixStudents.length}</span>}
              </label>
              <button type="button" onClick={() => navigate("/warden/students")} className="sheet-icon-button" title="Open student directory">
                <Users size={16} /> <span>Students</span> <ArrowUpRight size={14} />
              </button>
              <button type="button" onClick={downloadBlankSheet} disabled={summaryLoading} className="sheet-icon-button disabled:opacity-50">
                <FileSpreadsheet size={16} /> <span>Export blank</span>
              </button>
              <button type="button" onClick={() => window.print()} className="sheet-icon-button" title="Print attendance register">
                <Printer size={16} /> <span>Print</span>
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Monthly attendance</h2>
              <p className="mt-1 text-xs text-slate-500">Select any date, including past dates, then click cells to cycle status. Save to apply changes.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Legend color="bg-emerald-500" label="Present" />
              <Legend color="bg-rose-500" label="Absent" />
              <Legend color="bg-amber-500" label="Leave" />
              <Legend color="bg-slate-200" label="Not marked" />
            </div>
          </div>
          {summaryError && <div className="p-4"><ApiError message={summaryError} /></div>}
          {summaryLoading ? <Loading /> : (
            <div className="attendance-scroll max-h-[72vh] overflow-auto">
              <table className="attendance-table w-full min-w-[1450px] border-collapse text-[11px]">
                <thead className="sticky top-0 z-30 bg-[#29364B] text-white">
                  <tr>
                    <th className="sticky left-0 z-40 w-12 border border-slate-300 bg-[#29364B] px-2 py-3 text-left uppercase tracking-wide">#</th>
                    <th className="sticky left-12 z-40 w-16 border border-slate-300 bg-[#29364B] px-2 py-3 text-left uppercase tracking-wide">ID</th>
                    <th className="sticky left-28 z-40 w-48 border border-slate-300 bg-[#29364B] px-2 py-3 text-left uppercase tracking-wide">Student</th>
                    {matrixDays.map((day) => (
                      <th key={day} className={`w-7 border border-slate-600 px-0.5 py-1 text-center ${isWeekend(day) ? "bg-slate-200 text-slate-700" : ""} ${day === date ? "!bg-blue-600 text-white" : ""}`}>
                        <button type="button" onClick={() => selectDate(day)} aria-pressed={day === date} title={`Edit attendance for ${formatDay(day)}`} className="w-full rounded py-1 font-bold transition hover:bg-white/15">
                          {Number(day.slice(8, 10))}
                        </button>
                      </th>
                    ))}
                    <th className="w-16 border border-slate-600 px-1 py-3 uppercase tracking-wide">Days<br />elapsed</th>
                    <th className="w-20 border border-slate-600 px-1 py-3 uppercase tracking-wide">Present<br />this month</th>
                    <th className="w-20 border border-slate-600 px-1 py-3 uppercase tracking-wide">Present<br />previous</th>
                    <th className="w-20 border border-slate-600 px-1 py-3 uppercase tracking-wide">Absent<br />to date</th>
                    <th className="w-16 border border-slate-600 px-1 py-3 uppercase tracking-wide">Total<br />present</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatrixStudents.map((student, index) => (
                    <tr key={student._id} className={`group ${index % 2 ? "bg-slate-50" : "bg-white"} hover:bg-blue-50`}>
                      <td className={`sticky left-0 z-10 border border-slate-200 px-2 py-2 text-center font-medium text-slate-500 ${index % 2 ? "bg-slate-50 group-hover:bg-blue-50" : "bg-white group-hover:bg-blue-50"}`}>{index + 1}</td>
                      <td className={`sticky left-12 z-10 border border-slate-200 px-2 py-2 font-mono text-slate-600 ${index % 2 ? "bg-slate-50 group-hover:bg-blue-50" : "bg-white group-hover:bg-blue-50"}`}>{student.studentId || "—"}</td>
                      <td className={`sticky left-28 z-10 border border-slate-200 px-2 py-2 ${index % 2 ? "bg-slate-50 group-hover:bg-blue-50" : "bg-white group-hover:bg-blue-50"}`}>
                        <span className="block truncate font-semibold text-slate-800">{student.fullName}</span>
                        <span className="mt-0.5 block truncate text-[10px] text-slate-500">{[student.block, student.roomNumber].filter(Boolean).join(" · ") || "No room assigned"}</span>
                      </td>
                      {matrixDays.map((day) => {
                        const status = student.attendance[day] || "Not Marked";
                        return (
                          <td key={day} className={`border border-slate-200 p-0 text-center ${day === date ? "bg-blue-50" : isWeekend(day) ? "bg-slate-50" : ""}`}>
                            {day === date ? (
                              <button
                                type="button"
                                onClick={() => cycleStudentStatus(student._id, status)}
                                title={`${student.fullName}: ${status}. Click to change status.`}
                                aria-label={`${student.fullName}: ${status} on ${formatDay(day)}. Click to change status.`}
                                className={`h-8 w-full font-black transition hover:bg-blue-100 focus-visible:relative focus-visible:z-10 ${statusColor(status)}`}
                              >
                                {statusSymbol(status)}
                              </button>
                            ) : (
                              <span
                                title={`${student.fullName}: ${status} on ${formatDay(day)}. Select the date heading to edit.`}
                                className={`inline-flex h-8 w-full items-center justify-center font-black ${statusColor(status)}`}
                              >
                                {statusSymbol(status)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="border border-slate-200 px-1 py-2 text-center tabular-nums text-slate-600">{daysElapsed}</td>
                      <td className="border border-slate-200 px-1 py-2 text-center tabular-nums font-semibold text-emerald-700">{student.presentThisMonth}</td>
                      <td className="border border-slate-200 px-1 py-2 text-center tabular-nums text-slate-600">{student.presentBeforeMonth}</td>
                      <td className="border border-slate-200 px-1 py-2 text-center tabular-nums text-rose-700">{student.absentUptoThisMonth}</td>
                      <td className="border border-slate-200 px-1 py-2 text-center tabular-nums font-bold text-slate-800">{student.totalAttendance}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th colSpan="3" className="sticky left-0 z-20 border border-slate-300 bg-slate-100 px-3 py-2 text-left">Daily totals</th>
                    {dayTotals.map((day) => (
                      <td key={day.date} className="border border-slate-300 px-0.5 py-2 text-center text-[9px] leading-4">
                        <span className="text-emerald-700">P{day.present}</span><br />
                        <span className="text-rose-700">A{day.absent}</span>
                      </td>
                    ))}
                    <td className="border border-slate-300 px-1 py-2 text-center tabular-nums">{daysElapsed}</td>
                    <td className="border border-slate-300 px-1 py-2 text-center tabular-nums text-emerald-700">{monthlyTotals.present}</td>
                    <td className="border border-slate-300 px-1 py-2 text-center tabular-nums">{matrixStudents.reduce((total, student) => total + student.presentBeforeMonth, 0)}</td>
                    <td className="border border-slate-300 px-1 py-2 text-center tabular-nums text-rose-700">{matrixStudents.reduce((total, student) => total + student.absentUptoThisMonth, 0)}</td>
                    <td className="border border-slate-300 px-1 py-2 text-center tabular-nums font-bold">{matrixStudents.reduce((total, student) => total + student.totalAttendance, 0)}</td>
                  </tr>
                </tfoot>
              </table>
              {!filteredMatrixStudents.length && <p className="p-8 text-center text-sm text-[#566274]">{matrixStudents.length ? "No students match your search." : "No active student records are available."}</p>}
            </div>
          )}
          {saveError && <div className="border-t border-[#D3D7DC] p-4"><ApiError message={saveError} /></div>}
          {success && <div role="status" className="border-t border-[#D3D7DC] bg-[#EAF3ED] px-4 py-3 text-sm font-semibold text-[#28644B]">{success}</div>}
        </section>
      </div>

    </main>
  );
}

function formatMonth(month) {
  if (!month) return "this month";
  return new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function formatDay(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isWeekend(date) {
  const day = new Date(`${date}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

function statusSymbol(status) {
  return {
    Present: "✓",
    Absent: "×",
    Leave: "L",
    "Not Marked": "",
  }[status] || "—";
}

function statusColor(status) {
  return {
    Present: "text-[#39B980]",
    Absent: "text-[#E45454]",
    Leave: "text-[#A8792C]",
    "Not Marked": "text-transparent",
  }[status] || "text-transparent";
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}
    </span>
  );
}

function SheetMetric({ title, value, detail, tone, icon: Icon }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    green: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
        </div>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-3 truncate text-xs text-slate-500">{detail}</p>
    </div>
  );
}

export default WardenAttendance;
