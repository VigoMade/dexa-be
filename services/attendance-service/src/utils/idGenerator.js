import Attendance from "../models/Attendance.js";

export async function generateNextAttendanceId() {
  const last = await Attendance.findOne({
    attributes: ["id_absen"],
    order: [["id_absen", "DESC"]],
  });

  let nextNum = 1;
  if (last && last.id_absen) {
    const m = String(last.id_absen).match(/^ABSEN(\d{3})$/);
    if (m) nextNum = parseInt(m[1], 10) + 1;
  }

  const padded = String(nextNum).padStart(3, "0");
  return `ABSEN${padded}`;
}
