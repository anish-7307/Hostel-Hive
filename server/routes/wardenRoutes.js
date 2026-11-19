const express = require("express");
const { authorize, protect } = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/wardenController");

const router = express.Router();

router.use(protect, authorize("warden"));
router.get("/dashboard", getDashboard);
router.get("/attendance/summary", getMonthlyAttendanceSummary);
router.get("/attendance/matrix", getMonthlyAttendanceMatrix);
router.get("/attendance", getAttendance);
router.put("/attendance", saveAttendance);
router.get("/students", listStudents);
router.get("/leave-requests", listLeaveRequests);
router.patch("/leave-requests/:id/status", updateLeaveStatus);
router.get("/complaints", listComplaints);
router.patch("/complaints/:id/status", updateComplaintStatus);

module.exports = router;
