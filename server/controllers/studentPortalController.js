const Complaint = require("../models/Complaint");
const LeaveRequest = require("../models/LeaveRequest");

const createLeaveRequest = async (req, res) => {
  const { leaveType, fromDate, toDate, contact, reason } = req.body || {};
  const start = new Date(fromDate);
  const end = new Date(toDate);

  if ([leaveType, fromDate, toDate, contact, reason].some((value) => typeof value !== "string" || !value.trim()) ||
      Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return res.status(400).json({ success: false, message: "Provide a leave type, valid date range, contact number, and reason." });
  }

  const request = await LeaveRequest.create({
    student: req.user._id,
    leaveType,
    fromDate: start,
    toDate: end,
    contact,
    reason,
  });

  res.status(201).json({ success: true, data: request });
};

const listMyLeaveRequests = async (req, res) => {
  const requests = await LeaveRequest.find({ student: req.user._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  res.json({ success: true, data: requests });
};

const createComplaint = async (req, res) => {
  const { category, priority, title, description } = req.body || {};
  if ([category, title, description].some((value) => typeof value !== "string" || !value.trim())) {
    return res.status(400).json({ success: false, message: "Category, title, and description are required." });
  }
  if (priority && !["Low", "Medium", "High"].includes(priority)) {
    return res.status(400).json({ success: false, message: "Priority must be Low, Medium, or High." });
  }

  const complaint = await Complaint.create({
    student: req.user._id,
    category,
    priority: priority || "Medium",
    title,
    description,
  });

  res.status(201).json({ success: true, data: complaint });
};

const listMyComplaints = async (req, res) => {
  const complaints = await Complaint.find({ student: req.user._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  res.json({ success: true, data: complaints });
};

module.exports = {
  createLeaveRequest,
  listMyLeaveRequests,
  createComplaint,
  listMyComplaints,
};
