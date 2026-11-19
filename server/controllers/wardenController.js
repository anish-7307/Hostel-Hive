const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Complaint = require("../models/Complaint");
const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");

const listStudents = async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const filter = { role: "student" };

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedSearch, "i");
    filter.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { studentId: searchRegex },
    ];
  }

  const students = await User.find(filter)
    .select("fullName studentId email phone course year college roomNumber block isActive createdAt")
    .sort({ fullName: 1 })
    .limit(500)
    .lean();

  res.json({ success: true, data: students });
};

const getDashboard = async (_req, res) => {
  const [totalStudents, activeStudents, pendingLeaves, openComplaints, assignedRoomCount] =
    await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "student", isActive: true }),
      LeaveRequest.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: { $in: ["Open", "In Progress"] } }),
      User.distinct("roomNumber", { role: "student", roomNumber: { $exists: true, $ne: "" } }),
    ]);

  res.json({
    success: true,
    data: {
      totalStudents,
      activeStudents,
      pendingLeaves,
      openComplaints,
      assignedRooms: assignedRoomCount.length,
    },
  });
};

const isValidAttendanceDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

const isValidAttendanceMonth = (month) => {
  if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
    return false;
  }
  const parsed = new Date(`${month}-01T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 7) === month;
};

const getMonthlyAttendanceData = async (month, includeStudentTotals = false) => {
  const year = Number(month.slice(0, 4));
  const monthNumber = Number(month.slice(5, 7));
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const monthStart = `${month}-01`;
  const nextMonth = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const daysElapsed = today < monthStart
    ? 0
    : today >= nextMonth
      ? daysInMonth
      : Number(today.slice(8, 10));
  const students = await User.find({ role: "student", isActive: true })
    .select("fullName studentId email roomNumber block")
    .sort({ _id: 1 })
    .limit(1000)
    .lean();
  const records = await Attendance.find({
    date: { $gte: monthStart, $lt: nextMonth },
    student: { $in: students.map((student) => student._id) },
  })
    .select("student date status")
    .lean();
  const previousMonthStats = includeStudentTotals
    ? await Attendance.aggregate([
      {
        $match: {
          date: { $lt: monthStart },
          student: { $in: students.map((student) => student._id) },
        },
      },
      {
        $group: {
          _id: "$student",
          present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
        },
      },
    ])
    : [];
  const dailySummary = Array.from(
    { length: daysInMonth },
    (_, index) => ({
      date: `${month}-${String(index + 1).padStart(2, "0")}`,
      present: 0,
      absent: 0,
      leave: 0,
      notMarked: students.length,
    })
  );
  const summaryByDate = new Map(dailySummary.map((day) => [day.date, day]));
  const matrixStudents = students.map((student) => ({
    ...student,
    attendance: {},
    presentThisMonth: 0,
    absentThisMonth: 0,
    presentBeforeMonth: 0,
    absentUptoThisMonth: 0,
  }));
  const matrixStudentById = new Map(
    matrixStudents.map((student) => [student._id.toString(), student])
  );

  for (const stats of previousMonthStats) {
    const student = matrixStudentById.get(stats._id.toString());
    if (!student) continue;
    student.presentBeforeMonth = stats.present;
    student.absentUptoThisMonth = stats.absent;
  }

  for (const record of records) {
    const day = summaryByDate.get(record.date);
    if (!day) continue;
    const student = matrixStudentById.get(record.student.toString());
    if (!student) continue;

    student.attendance[record.date] = record.status;
    if (record.status === "Present") {
      day.present += 1;
      student.presentThisMonth += 1;
    }
    if (record.status === "Absent") {
      day.absent += 1;
      student.absentThisMonth += 1;
    }
    if (record.status === "Leave") day.leave += 1;
    day.notMarked -= 1;
  }

  for (const student of matrixStudents) {
    student.absentUptoThisMonth += student.absentThisMonth;
    student.totalAttendance = student.presentBeforeMonth + student.presentThisMonth;
  }

  return {
    days: dailySummary.map((day) => day.date),
    students: matrixStudents,
    summary: dailySummary,
    daysElapsed,
  };
};

const getMonthlyAttendanceSummary = async (req, res) => {
  const { month } = req.query;
  if (!isValidAttendanceMonth(month)) {
    return res.status(400).json({ success: false, message: "Provide a valid month in YYYY-MM format." });
  }
  const data = await getMonthlyAttendanceData(month);
  res.json({ success: true, data: data.summary });
};

const getMonthlyAttendanceMatrix = async (req, res) => {
  const { month } = req.query;
  if (!isValidAttendanceMonth(month)) {
    return res.status(400).json({ success: false, message: "Provide a valid month in YYYY-MM format." });
  }
  const data = await getMonthlyAttendanceData(month, true);
  res.json({ success: true, data });
};

const getAttendance = async (req, res) => {
  const { date } = req.query;
  if (!isValidAttendanceDate(date)) {
    return res.status(400).json({ success: false, message: "Provide a valid attendance date in YYYY-MM-DD format." });
  }

  const students = await User.find({ role: "student", isActive: true })
    .select("fullName studentId email roomNumber block")
    .sort({ fullName: 1 })
    .limit(1000)
    .lean();
  const records = await Attendance.find({
    date,
    student: { $in: students.map((student) => student._id) },
  }).lean();
  const recordByStudentId = new Map(records.map((record) => [record.student.toString(), record]));

  res.json({
    success: true,
    data: students.map((student) => ({
      ...student,
      status: recordByStudentId.get(student._id.toString())?.status || "Not Marked",
    })),
  });
};

const saveAttendance = async (req, res) => {
  const { date, entries } = req.body || {};
  if (!isValidAttendanceDate(date)) {
    return res.status(400).json({ success: false, message: "Provide a valid attendance date in YYYY-MM-DD format." });
  }
  if (!Array.isArray(entries) || entries.length === 0 || entries.length > 1000) {
    return res.status(400).json({ success: false, message: "Provide between 1 and 1000 attendance entries." });
  }

  const seenStudentIds = new Set();
  for (const entry of entries) {
    if (!entry || !mongoose.isValidObjectId(entry.studentId)) {
      return res.status(400).json({ success: false, message: "Each attendance entry must include a valid student ID." });
    }
    if (!["Present", "Absent", "Leave", "Not Marked"].includes(entry.status)) {
      return res.status(400).json({ success: false, message: "Attendance status must be Present, Absent, Leave, or Not Marked." });
    }
    if (seenStudentIds.has(entry.studentId)) {
      return res.status(400).json({ success: false, message: "A student can only be included once per attendance date." });
    }
    seenStudentIds.add(entry.studentId);
  }

  const students = await User.find({
    _id: { $in: [...seenStudentIds] },
    role: "student",
    isActive: true,
  }).select("_id").lean();
  if (students.length !== seenStudentIds.size) {
    return res.status(400).json({ success: false, message: "One or more selected students are unavailable." });
  }

  const operations = entries.map((entry) => entry.status === "Not Marked"
    ? {
      deleteOne: {
        filter: { student: entry.studentId, date },
      },
    }
    : {
      updateOne: {
        filter: { student: entry.studentId, date },
        update: {
          $set: { status: entry.status, markedBy: req.user._id },
        },
        upsert: true,
      },
    });
  const result = await Attendance.bulkWrite(operations, { ordered: true });

  res.json({
    success: true,
    data: {
      date,
      savedCount: entries.filter((entry) => entry.status !== "Not Marked").length,
      clearedCount: result.deletedCount,
    },
  });
};

const listLeaveRequests = async (req, res) => {
  const filter = {};
  const status = typeof req.query.status === "string" ? req.query.status : "";

  if (status) {
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid leave status filter." });
    }
    filter.status = status;
  }

  const requests = await LeaveRequest.find(filter)
    .populate("student", "fullName email studentId phone")
    .populate("reviewedBy", "fullName")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  res.json({ success: true, data: requests });
};

const updateLeaveStatus = async (req, res) => {
  const { status } = req.body || {};
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be Approved or Rejected." });
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid leave request ID." });
  }

  const request = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    { status, reviewedBy: req.user._id, reviewedAt: new Date() },
    { new: true, runValidators: true }
  )
    .populate("student", "fullName email studentId")
    .populate("reviewedBy", "fullName");

  if (!request) {
    return res.status(404).json({ success: false, message: "Leave request not found." });
  }

  res.json({ success: true, data: request });
};

const listComplaints = async (req, res) => {
  const filter = {};
  const status = typeof req.query.status === "string" ? req.query.status : "";

  if (status) {
    if (!["Open", "In Progress", "Resolved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid complaint status filter." });
    }
    filter.status = status;
  }

  const complaints = await Complaint.find(filter)
    .populate("student", "fullName email studentId")
    .populate("resolvedBy", "fullName")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  res.json({ success: true, data: complaints });
};

const updateComplaintStatus = async (req, res) => {
  const { status } = req.body || {};
  if (!["Open", "In Progress", "Resolved", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid complaint status." });
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid complaint ID." });
  }

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    {
      status,
      resolvedBy: status === "Resolved" ? req.user._id : undefined,
      resolvedAt: status === "Resolved" ? new Date() : undefined,
    },
    { new: true, runValidators: true }
  )
    .populate("student", "fullName email studentId")
    .populate("resolvedBy", "fullName");

  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found." });
  }

  res.json({ success: true, data: complaint });
};

module.exports = {
  getDashboard,
  getMonthlyAttendanceMatrix,
  getMonthlyAttendanceSummary,
  getAttendance,
  saveAttendance,
  listStudents,
  listLeaveRequests,
  updateLeaveStatus,
  listComplaints,
  updateComplaintStatus,
};
