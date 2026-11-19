import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  MessageSquare,
  Search,
  Users,
  WalletCards,
} from "lucide-react";
import { apiRequest, getApiToken } from "../../lib/api";

const featureData = {
  room: {
    title: "My Room",
    subtitle: "Room details and hostel allocation",
    icon: BedDouble,
  },
  attendance: {
    title: "Attendance",
    subtitle: "Monthly and overall attendance records",
    icon: CalendarCheck,
  },
  fees: {
    title: "Fees & Payments",
    subtitle: "Fee dues, payment history and receipts",
    icon: CreditCard,
  },
  leave: {
    title: "Leave",
    subtitle: "Submit and track leave requests",
    icon: CalendarCheck,
  },
  visitors: {
    title: "Visitors",
    subtitle: "Manage approved visitors and visit requests",
    icon: Users,
  },
  complaints: {
    title: "Complaints",
    subtitle: "Report issues and monitor ticket progress",
    icon: MessageSquare,
  },
  notifications: {
    title: "Notifications",
    subtitle: "Hostel notices and account updates",
    icon: Bell,
  },
};

function readStoredList(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function storeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

function StudentFeaturePage() {
  const location = useLocation();
  const feature = location.pathname.split("/").pop();
  const data = featureData[feature] || featureData.notifications;
  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-[#F3E8D0] text-[#241719]">
      <header className="border-b border-[#E3CFAD] bg-[#FFF9EF]/90 px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="rounded-2xl bg-[#5A1725] p-3 text-[#FFF9EF]">
            <Icon size={23} />
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{data.title}</h1>
            <p className="mt-1 text-sm text-[#604B4F]">{data.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {feature === "room" && <RoomContent />}
        {feature === "attendance" && <AttendanceContent />}
        {feature === "fees" && <FeesContent />}
        {feature === "leave" && <LeaveContent />}
        {feature === "visitors" && <VisitorsContent />}
        {feature === "complaints" && <ComplaintsContent />}
        {feature === "notifications" && <NotificationsContent />}
      </main>
    </div>
  );
}

function RoomContent() {
  const roommates = [
    ["Anish Rai", "A-204", "Bed 1"],
    ["Rohan Kumar", "A-204", "Bed 2"],
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-3">
        <SummaryCard label="Room Number" value="A-204" detail="Block A, 2nd Floor" icon={BedDouble} />
        <SummaryCard label="Room Type" value="3 Seater" detail="Non-AC" icon={Users} />
        <SummaryCard label="Monthly Rent" value="₹4,500" detail="Included in hostel fee" icon={IndianRupee} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Roommates</h2>
          <p className="mt-1 text-sm text-[#604B4F]">Students currently assigned to this room</p>
          <div className="mt-5 space-y-3">
            {roommates.map(([name, room, bed]) => (
              <div key={name} className="flex items-center gap-4 rounded-2xl bg-[#F8EEDC] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5A1725] text-sm font-bold text-white">
                  {name.split(" ").map((part) => part[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{name}</p>
                  <p className="text-xs text-[#604B4F]">{bed}</p>
                </div>
                <span className="rounded-full bg-[#EAF3ED] px-3 py-1 text-xs font-bold text-[#28644B]">{room}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Facilities</h2>
          <div className="mt-5 space-y-3">
            {["Two study desks", "Attached cupboard", "Wi-Fi enabled", "24/7 water supply"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-[#28644B]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AttendanceContent() {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const present = new Set([1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30]);

  return (
    <div className="space-y-6">
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard label="Present" value="24 days" detail="This month" icon={CheckCircle2} />
        <SummaryCard label="Absent" value="4 days" detail="2 excused" icon={AlertCircle} />
        <SummaryCard label="Leave" value="2 days" detail="Approved" icon={Clock3} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">November 2026</h2>
              <p className="mt-1 text-sm text-[#604B4F]">Daily attendance overview</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-[#604B4F]">{day}</div>
            ))}
            {days.map((day) => (
              <div
                key={day}
                className={`flex aspect-square items-center justify-center rounded-xl text-sm font-bold ${
                  present.has(day)
                    ? "bg-[#EAF3ED] text-[#28644B]"
                    : day === 18
                      ? "bg-[#FFF2D6] text-[#9A6916]"
                      : "bg-[#FBEAEA] text-[#9B2C2C]"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Recent Status</h2>
          <div className="mt-5 space-y-4">
            {[["Today, 18 Nov", "Present"], ["17 Nov", "Present"], ["16 Nov", "Leave"], ["15 Nov", "Absent"]].map(([date, status]) => (
              <div key={date} className="flex items-center justify-between border-b border-[#E3CFAD]/70 pb-3 text-sm">
                <span>{date}</span>
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeesContent() {
  const [paid, setPaid] = useState(() => localStorage.getItem("hostel_maintenance_paid") === "true");

  const fees = [
    ["Hostel rent - November", "₹4,500", "Paid"],
    ["Mess charges - November", "₹3,200", "Paid"],
    ["Maintenance fee", "₹800", "Due"],
    ["Security deposit", "₹3,500", "Paid"],
  ];

  return (
    <div className="space-y-6">
      {paid && (
        <div role="status" className="rounded-2xl border border-[#28644B]/20 bg-[#EAF3ED] px-5 py-4 text-sm font-semibold text-[#28644B]">
          Payment initiation saved. Continue with your payment provider to complete it.
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard label="Total Fee" value="₹12,000" detail="Academic year" icon={WalletCards} />
        <SummaryCard label="Amount Paid" value="₹11,200" detail="3 transactions" icon={CheckCircle2} />
        <SummaryCard label="Due Amount" value="₹800" detail="Due 30 Nov 2026" icon={IndianRupee} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Fee Breakdown</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#E3CFAD]">
            {fees.map(([name, amount, status]) => (
              <div key={name} className="flex items-center gap-4 border-b border-[#E3CFAD] px-4 py-4 last:border-0">
                <div className="rounded-xl bg-[#F3E8D0] p-3 text-[#5A1725]"><CreditCard size={19} /></div>
                <p className="flex-1 font-semibold">{name}</p>
                <p className="font-bold">{amount}</p>
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Payment</h2>
          <p className="mt-2 text-sm text-[#604B4F]">One outstanding maintenance fee is waiting.</p>
          <div className="mt-5 rounded-2xl bg-[#F8EEDC] p-5">
            <p className="text-sm text-[#604B4F]">Amount due</p>
            <p className="mt-1 text-3xl font-bold text-[#5A1725]">₹800</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPaid(true);
              localStorage.setItem("hostel_maintenance_paid", "true");
            }}
            disabled={paid}
            className="mt-5 w-full rounded-2xl bg-[#5A1725] py-3.5 font-bold text-[#FFF9EF] transition hover:-translate-y-0.5 hover:bg-[#7A2638]"
          >
            {paid ? "Payment Completed" : "Pay Now"}
          </button>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
        <h2 className="text-xl font-bold">Payment History</h2>
        <div className="mt-5 space-y-3">
          {[["15 Nov 2026", "Security deposit", "₹3,500", "TXN-001284"], ["01 Nov 2026", "November hostel fee", "₹4,500", "TXN-001191"], ["01 Nov 2026", "November mess fee", "₹3,200", "TXN-001190"]].map(([date, name, amount, txn]) => (
            <div key={txn} className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#F8EEDC] px-4 py-4">
              <div className="flex-1">
                <p className="font-semibold">{name}</p>
                <p className="mt-1 text-xs text-[#604B4F]">{date} • {txn}</p>
              </div>
              <p className="font-bold">{amount}</p>
              <StatusBadge status="Paid" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LeaveContent() {
  const [submitted, setSubmitted] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState(() => readStoredList("hostel_leave_requests"));
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getApiToken()) return;
    let active = true;
    apiRequest("/student/leave-requests")
      .then((result) => {
        if (active) setLeaveHistory(result.data.map((request) => ({
          date: `${formatDate(request.fromDate)} - ${formatDate(request.toDate)}`,
          reason: request.leaveType,
          status: request.status,
        })));
      })
      .catch((error) => {
        if (active) setSubmitError(error.message);
      });
    return () => { active = false; };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setSubmitError("");
    try {
      const result = await apiRequest("/student/leave-requests", {
        method: "POST",
        body: Object.fromEntries(form.entries()),
      });
      const request = {
        date: `${formatDate(result.data.fromDate)} - ${formatDate(result.data.toDate)}`,
        reason: result.data.leaveType,
        status: result.data.status,
      };
      setLeaveHistory((current) => [request, ...current]);
      setSubmitted(true);
      event.currentTarget.reset();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <div role="status" className="rounded-2xl border border-[#28644B]/20 bg-[#EAF3ED] px-5 py-4 text-sm font-semibold text-[#28644B]">
          Leave request submitted successfully and awaiting warden approval.
        </div>
      )}
      {submitError && <div role="alert" className="rounded-2xl border border-[#9B2C2C]/20 bg-[#FBEAEA] px-5 py-4 text-sm text-[#9B2C2C]">{submitError}</div>}

      <section className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Apply for Leave</h2>
          <p className="mt-1 text-sm text-[#604B4F]">Submit a new leave request to the warden</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Leave type" name="leaveType">
              <select name="leaveType" required className="form-control" defaultValue="">
                <option value="" disabled>Select type</option>
                <option>Home leave</option>
                <option>Medical leave</option>
                <option>Emergency leave</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="From date" name="fromDate">
              <input name="fromDate" required type="date" className="form-control" />
            </Field>
            <Field label="To date" name="toDate">
              <input name="toDate" required type="date" className="form-control" />
            </Field>
            <Field label="Contact number" name="contact">
              <input name="contact" required type="tel" placeholder="98765 43210" className="form-control" />
            </Field>
          </div>
          <Field label="Reason" name="reason" className="mt-5">
            <textarea name="reason" required rows="4" placeholder="Briefly explain your reason..." className="form-control resize-none" />
          </Field>
          <button type="submit" disabled={saving} className="mt-5 rounded-2xl bg-[#5A1725] px-6 py-3 font-bold text-[#FFF9EF] transition hover:-translate-y-0.5 hover:bg-[#7A2638] disabled:cursor-wait disabled:opacity-60">
            {saving ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Leave Summary</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <SummaryCard label="Approved" value="4" detail="This semester" />
            <SummaryCard label="Pending" value="1" detail="Awaiting review" />
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
        <h2 className="text-xl font-bold">Leave History</h2>
        <div className="mt-5 space-y-3">
          {[...leaveHistory].map((request, index) => (
            <div key={`${request.date}-${request.reason}-${index}`} className="flex items-center gap-4 rounded-2xl bg-[#F8EEDC] p-4">
              <CalendarCheck size={20} className="text-[#5A1725]" />
              <div className="flex-1"><p className="font-semibold">{request.reason}</p><p className="mt-1 text-xs text-[#604B4F]">{request.date}</p></div>
              <StatusBadge status={request.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function VisitorsContent() {
  const [submitted, setSubmitted] = useState(false);
  const [visitorSearch, setVisitorSearch] = useState("");
  const [visitorRecords, setVisitorRecords] = useState(() => readStoredList("hostel_visitor_requests"));

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record = {
      name: form.get("visitorName").toString(),
      date: `${form.get("visitDate")}, ${form.get("visitTime")}`,
      relation: "Pre-approved",
      status: "Approved",
    };
    const nextRecords = [record, ...visitorRecords];
    setVisitorRecords(nextRecords);
    storeList("hostel_visitor_requests", nextRecords);
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <div role="status" className="rounded-2xl border border-[#28644B]/20 bg-[#EAF3ED] px-5 py-4 text-sm font-semibold text-[#28644B]">
          Visitor request submitted and sent for approval.
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Add Visitor</h2>
          <p className="mt-1 text-sm text-[#604B4F]">Pre-register someone for your next visit</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Visitor name" name="visitorName">
              <input name="visitorName" required placeholder="Full name" className="form-control" />
            </Field>
            <Field label="Phone number" name="visitorPhone">
              <input name="visitorPhone" required type="tel" placeholder="98765 43210" className="form-control" />
            </Field>
            <Field label="Visit date" name="visitDate">
              <input name="visitDate" required type="date" className="form-control" />
            </Field>
            <Field label="Expected time" name="visitTime">
              <input name="visitTime" required type="time" className="form-control" />
            </Field>
          </div>
          <Field label="Purpose of visit" name="purpose" className="mt-5">
            <textarea name="purpose" required rows="3" placeholder="Family visit, guardian meeting..." className="form-control resize-none" />
          </Field>
          <button type="submit" className="mt-5 rounded-2xl bg-[#5A1725] px-6 py-3 font-bold text-[#FFF9EF] transition hover:-translate-y-0.5 hover:bg-[#7A2638]">
            Submit Visitor Request
          </button>
        </form>

        <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Visitor Summary</h2>
          <div className="mt-5 space-y-3">
            <SummaryCard label="Approved" value="3" detail="This month" icon={CheckCircle2} />
            <SummaryCard label="Upcoming" value="1" detail="Next 7 days" icon={Clock3} />
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Visitor Records</h2>
            <p className="mt-1 text-sm text-[#604B4F]">Recent and upcoming visits</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-3 py-2">
            <Search size={16} className="text-[#604B4F]" />
            <input
              aria-label="Search visitors"
              value={visitorSearch}
              onChange={(event) => setVisitorSearch(event.target.value)}
              placeholder="Search"
              className="w-32 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {[
            ...visitorRecords.map((record) => [record.name, record.date, record.relation, record.status]),
            ["Suresh Rai", "21 Nov 2026, 11:30 AM", "Father", "Approved"],
            ["Pooja Kumar", "18 Nov 2026, 4:00 PM", "Sister", "Checked out"],
            ["Dr. Mehta", "12 Nov 2026, 10:00 AM", "Medical", "Checked out"],
          ].filter(([name, date, relation]) =>
            `${name} ${date} ${relation}`.toLowerCase().includes(visitorSearch.toLowerCase())
          ).map(([name, date, relation, status]) => (
            <div key={`${name}-${date}`} className="flex items-center gap-4 rounded-2xl bg-[#F8EEDC] p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5A1725] text-sm font-bold text-white">
                {name.split(" ").map((part) => part[0]).join("")}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{name}</p>
                <p className="mt-1 text-xs text-[#604B4F]">{relation} • {date}</p>
              </div>
              <StatusBadge status={status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ComplaintsContent() {
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getApiToken()) return;
    let active = true;
    apiRequest("/student/complaints")
      .then((result) => {
        if (active) setTickets(result.data);
      })
      .catch((error) => {
        if (active) setSubmitError(error.message);
      });
    return () => { active = false; };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setSubmitError("");
    try {
      const result = await apiRequest("/student/complaints", {
        method: "POST",
        body: Object.fromEntries(form.entries()),
      });
      setTickets((current) => [result.data, ...current]);
      setSubmitted(true);
      event.currentTarget.reset();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <div role="status" className="rounded-2xl border border-[#28644B]/20 bg-[#EAF3ED] px-5 py-4 text-sm font-semibold text-[#28644B]">
          Complaint submitted successfully. A ticket has been created.
        </div>
      )}
      {submitError && <div role="alert" className="rounded-2xl border border-[#9B2C2C]/20 bg-[#FBEAEA] px-5 py-4 text-sm text-[#9B2C2C]">{submitError}</div>}

      <section className="grid gap-5 sm:grid-cols-3">
        <SummaryCard label="Open" value={tickets.filter((item) => item.status === "Open").length} detail="Needs attention" icon={AlertCircle} />
        <SummaryCard label="In Progress" value={tickets.filter((item) => item.status === "In Progress").length} detail="Being resolved" icon={Clock3} />
        <SummaryCard label="Resolved" value={tickets.filter((item) => item.status === "Resolved").length} detail="This semester" icon={CheckCircle2} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Report a Complaint</h2>
          <p className="mt-1 text-sm text-[#604B4F]">Describe the issue clearly for faster resolution</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Category" name="category">
              <select name="category" required className="form-control" defaultValue="">
                <option value="" disabled>Select category</option>
                <option>Room maintenance</option>
                <option>Electrical</option>
                <option>Water supply</option>
                <option>Cleanliness</option>
                <option>Mess</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Priority" name="priority">
              <select name="priority" required className="form-control" defaultValue="Medium">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </Field>
          </div>
          <Field label="Title" name="title" className="mt-5">
            <input name="title" required placeholder="Brief issue title" className="form-control" />
          </Field>
          <Field label="Description" name="description" className="mt-5">
            <textarea name="description" required rows="4" placeholder="Describe what happened..." className="form-control resize-none" />
          </Field>
          <button type="submit" disabled={saving} className="mt-5 rounded-2xl bg-[#5A1725] px-6 py-3 font-bold text-[#FFF9EF] transition hover:-translate-y-0.5 hover:bg-[#7A2638] disabled:cursor-wait disabled:opacity-60">
            {saving ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        <div className="rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-6">
          <h2 className="text-xl font-bold">Recent Tickets</h2>
          <div className="mt-5 space-y-3">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket._id} className="rounded-2xl bg-[#F8EEDC] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[#604B4F]">{ticket.ticket}</p>
                  <StatusBadge status={ticket.status} />
                </div>
                <p className="mt-2 text-sm font-semibold">{ticket.title}</p>
              </div>
            ))}
            {!tickets.length && <p className="py-6 text-sm text-[#604B4F]">Your submitted complaints will appear here.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function NotificationsContent() {
  const [readIds, setReadIds] = useState(() => readStoredList("hostel_read_notifications"));

  const notifications = [
    ["maintenance", "Hostel maintenance scheduled", "Maintenance work will take place in Block A from 10:00 AM to 2:00 PM.", "26 Oct 2026 • 9:20 AM"],
    ["mess", "Mess feedback form is open", "Share your feedback for the October mess menu before Friday.", "25 Oct 2026 • 6:15 PM"],
    ["attendance", "Attendance has been updated", "Your November attendance record is now available.", "24 Oct 2026 • 11:05 AM"],
    ["fees", "Fee reminder", "Your maintenance fee of ₹800 is due on 30 November.", "22 Oct 2026 • 8:30 AM"],
  ];

  const unreadCount = notifications.filter(([id]) => !readIds.includes(id)).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-[#E3CFAD] bg-[#FFF9EF] p-5">
        <div>
          <p className="text-lg font-bold">{unreadCount} unread notifications</p>
          <p className="mt-1 text-sm text-[#604B4F]">Stay updated with the latest hostel information</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextIds = notifications.map(([id]) => id);
            setReadIds(nextIds);
            storeList("hostel_read_notifications", nextIds);
          }}
          disabled={unreadCount === 0}
          className="rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-4 py-2.5 text-sm font-bold text-[#5A1725] disabled:cursor-default disabled:opacity-50"
        >
          Mark all as read
        </button>
      </section>

      <section className="space-y-3">
        {notifications.map(([id, title, message, date]) => {
          const isUnread = !readIds.includes(id);

          return (
            <button
              type="button"
              key={id}
              onClick={() => setReadIds((current) => {
                const nextIds = current.includes(id) ? current : [...current, id];
                storeList("hostel_read_notifications", nextIds);
                return nextIds;
              })}
              className={`flex w-full items-start gap-4 rounded-[22px] border p-5 text-left transition hover:-translate-y-0.5 ${
                isUnread
                  ? "border-[#C69C5A]/70 bg-[#FFF9EF] shadow-[0_8px_24px_rgba(90,23,37,0.08)]"
                  : "border-[#E3CFAD] bg-[#F8EEDC]/70"
              }`}
            >
              <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${isUnread ? "bg-[#7A2638]" : "bg-[#E3CFAD]"}`} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-bold">{title}</h2>
                  {isUnread && <span className="rounded-full bg-[#FBEAEA] px-2.5 py-1 text-[11px] font-bold text-[#9B2C2C]">Unread</span>}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#604B4F]">{message}</p>
                <p className="mt-3 text-xs font-semibold text-[#604B4F]">{date}</p>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, detail, icon: Icon }) {
  return (
    <div className="card-3d rounded-[24px] border border-[#E3CFAD] bg-[#FFF9EF] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#604B4F]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#241719]">{value}</p>
          {detail && <p className="mt-1 text-xs text-[#604B4F]">{detail}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl bg-[#F3E8D0] p-2.5 text-[#5A1725]">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Paid: "bg-[#EAF3ED] text-[#28644B]",
    Due: "bg-[#FFF2D6] text-[#9A6916]",
    Approved: "bg-[#EAF3ED] text-[#28644B]",
    Present: "bg-[#EAF3ED] text-[#28644B]",
    Absent: "bg-[#FBEAEA] text-[#9B2C2C]",
    Leave: "bg-[#FFF2D6] text-[#9A6916]",
    Pending: "bg-[#FFF2D6] text-[#9A6916]",
    "In Progress": "bg-[#EDF3F7] text-[#315D78]",
    Resolved: "bg-[#EAF3ED] text-[#28644B]",
    "Checked out": "bg-[#F3E8D0] text-[#604B4F]",
  };

  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${styles[status] || "bg-[#F3E8D0] text-[#604B4F]"}`}>
      {status}
    </span>
  );
}

function Field({ label, name, className = "", children }) {
  return (
    <label htmlFor={name} className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-[#241719]">{label}</span>
      {children}
    </label>
  );
}

export default StudentFeaturePage;
