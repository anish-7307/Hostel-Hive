const mongoose = require("mongoose");
const Staff = require("../models/Staff");
const StaffAttendance = require("../models/StaffAttendance");
const User = require("../models/User");

const staffDepartments = ["Warden", "Security", "Housekeeping", "Kitchen", "Maintenance", "Other"];
const attendanceStatuses = ["Present", "Absent", "Leave", "Not Marked"];

const isValidDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

const listStudents = async (_req, res) => {
  const students = await User.find({ role: "student", isActive: true })
    .select("fullName studentId email phone course year college roomNumber block")
    .sort({ block: 1, roomNumber: 1, fullName: 1 })
    .limit(2000)
    .lean();

  res.json({ success: true, data: students });
};

const listStaff = async (req, res) => {
  const { date } = req.query;
  if (!isValidDate(date)) {
    return res.status(400).json({ success: false, message: "Provide a valid staff attendance date in YYYY-MM-DD format." });
  }

  const staff = await Staff.find({ isActive: true })
    .sort({ department: 1, fullName: 1 })
    .limit(1000)
    .lean();
  const attendance = await StaffAttendance.find({
    date,
    staff: { $in: staff.map((member) => member._id) },
  })
    .select("staff status")
    .lean();
  const statusByStaffId = new Map(
    attendance.map((record) => [record.staff.toString(), record.status])
  );

  res.json({
    success: true,
    data: staff.map((member) => ({
      ...member,
      attendanceStatus: statusByStaffId.get(member._id.toString()) || "Not Marked",
    })),
  });
};

const createStaff = async (req, res) => {
  const { fullName, staffId, department, assignedWork, email, phone } = req.body || {};
  if (typeof fullName !== "string" || !fullName.trim()) {
    return res.status(400).json({ success: false, message: "Staff name is required." });
  }
  if (typeof staffId !== "string" || !/^[A-Za-z0-9-]{2,30}$/.test(staffId.trim())) {
    return res.status(400).json({ success: false, message: "Provide a staff ID containing 2 to 30 letters, numbers, or hyphens." });
  }
  if (!staffDepartments.includes(department)) {
    return res.status(400).json({ success: false, message: "Select a valid staff department." });
  }
  if (typeof assignedWork !== "string" || !assignedWork.trim() || assignedWork.trim().length > 200) {
    return res.status(400).json({ success: false, message: "Assigned work is required and must be 200 characters or fewer." });
  }
  if (email !== undefined && email !== null && typeof email !== "string") {
    return res.status(400).json({ success: false, message: "Provide a valid email address." });
  }
  if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ success: false, message: "Provide a valid email address." });
  }
  if (phone !== undefined && phone !== null && typeof phone !== "string") {
    return res.status(400).json({ success: false, message: "Phone number must be text." });
  }

  const staff = await Staff.create({
    fullName: fullName.trim(),
    staffId: staffId.trim().toUpperCase(),
    department,
    assignedWork: assignedWork.trim(),
    ...(email?.trim() ? { email: email.trim().toLowerCase() } : {}),
    ...(phone?.trim() ? { phone: phone.trim() } : {}),
  });

  res.status(201).json({ success: true, data: staff });
};

const updateStaffWork = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid staff ID." });
  }
  const { assignedWork } = req.body || {};
  if (typeof assignedWork !== "string" || !assignedWork.trim() || assignedWork.trim().length > 200) {
    return res.status(400).json({ success: false, message: "Assigned work is required and must be 200 characters or fewer." });
  }

  const staff = await Staff.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    { assignedWork: assignedWork.trim() },
    { returnDocument: "after", runValidators: true }
  );
  if (!staff) {
    return res.status(404).json({ success: false, message: "Active staff member not found." });
  }

  res.json({ success: true, data: staff });
};

const saveStaffAttendance = async (req, res) => {
  const { date, entries } = req.body || {};
  if (!isValidDate(date)) {
    return res.status(400).json({ success: false, message: "Provide a valid staff attendance date in YYYY-MM-DD format." });
  }
  if (!Array.isArray(entries) || entries.length === 0 || entries.length > 1000) {
    return res.status(400).json({ success: false, message: "Provide between 1 and 1000 staff attendance entries." });
  }

  const staffIds = new Set();
  for (const entry of entries) {
    if (!entry || !mongoose.isValidObjectId(entry.staffId)) {
      return res.status(400).json({ success: false, message: "Each staff attendance entry must include a valid staff ID." });
    }
    if (!attendanceStatuses.includes(entry.status)) {
      return res.status(400).json({ success: false, message: "Staff attendance status must be Present, Absent, Leave, or Not Marked." });
    }
    if (staffIds.has(entry.staffId)) {
      return res.status(400).json({ success: false, message: "A staff member can only be included once per attendance date." });
    }
    staffIds.add(entry.staffId);
  }

  const staff = await Staff.find({
    _id: { $in: [...staffIds] },
    isActive: true,
  }).select("_id").lean();
  if (staff.length !== staffIds.size) {
    return res.status(400).json({ success: false, message: "One or more selected staff members are unavailable." });
  }

  const operations = entries.map((entry) => entry.status === "Not Marked"
    ? {
      deleteOne: {
        filter: { staff: entry.staffId, date },
      },
    }
    : {
      updateOne: {
        filter: { staff: entry.staffId, date },
        update: { $set: { status: entry.status, markedBy: req.user._id } },
        upsert: true,
      },
    });
  const result = await StaffAttendance.bulkWrite(operations, { ordered: true });

  res.json({
    success: true,
    data: {
      date,
      savedCount: entries.filter((entry) => entry.status !== "Not Marked").length,
      clearedCount: result.deletedCount,
    },
  });
};

module.exports = {
  listStudents,
  listStaff,
  createStaff,
  updateStaffWork,
  saveStaffAttendance,
};
