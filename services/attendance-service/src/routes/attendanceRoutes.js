import { Router } from "express";
import { getAllAttendance, getMyAttendance, clockIn,getMyAttendanceNow, clockOut } from "../controllers/attendanceController.js";
import auth from "../middlewares/auth.js";

const router = Router();


router.use(auth);


router.get("/", getAllAttendance);

router.get("/me", auth, getMyAttendance);
router.post("/clockin", auth, clockIn);
router.get("/me/now", auth, getMyAttendanceNow);
router.put("/clockout", auth, clockOut);
export default router;
