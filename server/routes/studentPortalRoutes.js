const express = require("express");
const { authorize, protect } = require("../middleware/authMiddleware");
const {
  createLeaveRequest,
  listMyLeaveRequests,
  createComplaint,
  listMyComplaints,
} = require("../controllers/studentPortalController");

const router = express.Router();

router.use(protect, authorize("student"));
router.route("/leave-requests").get(listMyLeaveRequests).post(createLeaveRequest);
router.route("/complaints").get(listMyComplaints).post(createComplaint);

module.exports = router;
