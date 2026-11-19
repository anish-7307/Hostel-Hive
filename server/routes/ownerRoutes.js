const express = require("express");
const { authorize, protect } = require("../middleware/authMiddleware");
const {
  listStudents,
  listStaff,
  createStaff,
  updateStaffWork,
  saveStaffAttendance,
} = require("../controllers/ownerController");

const router = express.Router();

router.use(protect, authorize("owner"));
router.get("/students", listStudents);
router.get("/staff", listStaff);
router.post("/staff", createStaff);
router.patch("/staff/:id/work", updateStaffWork);
router.put("/staff/attendance", saveStaffAttendance);

module.exports = router;
