import { Op } from "sequelize";
import { sequelize } from "../config/db.js";
import Attendance from "../models/Attendance.js";
import { generateNextAttendanceId } from "../utils/idGenerator.js";

function hhmm(d) {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function extractBase64(dataUrl) {
  if (!dataUrl) return null;
  const idx = dataUrl.indexOf("base64,");
  return idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl;
}

export const getAllAttendance = async (req, res) => {
  try {
    const where = {};
    const q = req.query.q;

    if (q) {
      where.nama_karyawan = { [Op.like]: `%${q}%` };
    }

    const records = await Attendance.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    const mapped = records.map(r => {
      const data = r.toJSON();
      if (data.foto_clockin) data.foto_clockin = data.foto_clockin.toString("base64");
      if (data.foto_clockout) data.foto_clockout = data.foto_clockout.toString("base64");
      return data;
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
};


function parseMonthToRange(monthParam) {
  if (!monthParam) return null;


  if (/^\d{4}-\d{2}$/.test(monthParam)) {
    const start = `${monthParam}-01`;
    const end = new Date(`${monthParam}-01T00:00:00.000Z`);
    end.setMonth(end.getMonth() + 1);
    return { start, end: end.toISOString().slice(0, 10) };
  }

  const maybe = new Date(`${monthParam} 01 00:00:00`);
  if (!isNaN(maybe.getTime())) {
    const y = maybe.getFullYear();
    const m = String(maybe.getMonth() + 1).padStart(2, "0");
    const start = `${y}-${m}-01`;
    const end = new Date(`${start}T00:00:00.000Z`);
    end.setMonth(end.getMonth() + 1);
    return { start, end: end.toISOString().slice(0, 10) };
  }

  return null;
}

export const getMyAttendance = async (req, res) => {
  try {
    const nama = req.user?.name;
    if (!nama) return res.status(400).json({ message: "Invalid token payload" });

    const where = { nama_karyawan: nama };
    const range = parseMonthToRange(req.query.month);

    if (range) {
      where.created_at = { [Op.gte]: range.start, [Op.lt]: range.end };
    }

    const rows = await Attendance.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    const mapped = rows.map((r) => {
      const data = r.toJSON();
      if (data.foto_clockin?.buffer) data.foto_clockin = Buffer.from(data.foto_clockin).toString("base64");
      if (data.foto_clockout?.buffer) data.foto_clockout = Buffer.from(data.foto_clockout).toString("base64");
      return data;
    });

    res.json(mapped);
  } catch (err) {
    console.error("getMyAttendance error:", err.message);
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
};

export const clockIn = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const nama = req.user?.name;
    if (!nama) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const { photoBase64, note } = req.body || {};
    const base64 = extractBase64(photoBase64);
    if (!base64) {
      await t.rollback();
      return res.status(400).json({ message: "Foto clock in (base64) wajib ada" });
    }
    const fotoBuf = Buffer.from(base64, "base64");

    const now = new Date(); 
    const nowHHMM = hhmm(now);
    const isLate = (now.getHours() > 8) || (now.getHours() === 8 && now.getMinutes() > 1);
    const status = isLate ? "Terlambat" : "Hadir";


    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    const already = await Attendance.findOne({
      where: {
        nama_karyawan: nama,
        created_at: { [Op.gte]: start, [Op.lt]: end },
      },
      transaction: t,
    });

    if (already) {
      await t.rollback();
      return res.status(409).json({ message: "Anda sudah clock-in hari ini" });
    }

    const id_absen = await generateNextAttendanceId();

    
    const payload = {
      id_absen,
      nama_karyawan: nama,
      clockin_at: now,              
      clockout_at: null,
      status,
      foto_clockin: fotoBuf,
      foto_clockout: null,
      catatan: note ?? null,
      created_at: now,
    };

    await Attendance.create(payload, { transaction: t });
    await t.commit();

    return res.status(201).json({
      id_absen,
      nama_karyawan: nama,
      clockin_time: nowHHMM,
      status,
    });
  } catch (err) {
    await t.rollback();
    console.error("clockIn error:", err.message);
    return res.status(500).json({ message: "Clock in failed", error: err.message });
  }
};

export const getMyAttendanceNow = async (req, res) => {
  try {
    const nama = req.user?.name;
    if (!nama) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    const row = await Attendance.findOne({
      where: {
        nama_karyawan: nama,
        created_at: { [Op.gte]: start, [Op.lt]: end },
      },
      order: [["created_at", "DESC"]],
    });

    if (!row) {
      return res.json(null); 
    }

    const data = row.toJSON();
    if (data.foto_clockin?.buffer) {
      data.foto_clockin = Buffer.from(data.foto_clockin).toString("base64");
    }
    if (data.foto_clockout?.buffer) {
      data.foto_clockout = Buffer.from(data.foto_clockout).toString("base64");
    }

    return res.json(data);
  } catch (err) {
    console.error("getMyAttendanceNow error:", err.message);
    return res.status(500).json({ message: "Error fetching today's attendance", error: err.message });
  }
};

export const clockOut = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const nama = req.user?.name;
    if (!nama) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const { photoBase64, note } = req.body || {};
    const base64 = extractBase64(photoBase64);
    if (!base64) {
      await t.rollback();
      return res.status(400).json({ message: "Foto clock out (base64) wajib ada" });
    }
    const fotoBuf = Buffer.from(base64, "base64");

    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    const record = await Attendance.findOne({
      where: {
        nama_karyawan: nama,
        created_at: { [Op.gte]: start, [Op.lt]: end },
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!record) {
      await t.rollback();
      return res.status(404).json({ message: "Belum clock-in hari ini" });
    }
    if (record.clockout_at) {
      await t.rollback();
      return res.status(409).json({ message: "Anda sudah clock-out hari ini" });
    }

    record.clockout_at = now;
    record.foto_clockout = fotoBuf;
    if (note) {
      record.catatan = note;
    }
    await record.save({ transaction: t });
    await t.commit();

    return res.json({
      id_absen: record.id_absen,
      nama_karyawan: record.nama_karyawan,
      clockin_time: hhmm(new Date(record.clockin_at)),
      clockout_time: hhmm(now),
      status: record.status,
    });
  } catch (err) {
    await t.rollback();
    console.error("clockOut error:", err.message);
    return res.status(500).json({ message: "Clock out failed", error: err.message });
  }
};


export const showAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;                 
    const row = await Attendance.findByPk(id); 
    if (!row) return res.status(404).json({ message: "Attendance not found" });

    const d = row.toJSON();
  
    if (d.foto_clockin?.buffer) d.foto_clockin = Buffer.from(d.foto_clockin).toString("base64");
    if (d.foto_clockout?.buffer) d.foto_clockout = Buffer.from(d.foto_clockout).toString("base64");
    return res.json(d);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching detail", error: err.message });
  }
};


export const showAttendanceByName = async (req, res) => {
  try {
    const { name } = req.params;
    const rows = await Attendance.findAll({
      where: { nama_karyawan: name },
      order: [["created_at", "DESC"]],
    });

    const mapped = rows.map(r => {
      const d = r.toJSON();
      if (d.foto_clockin?.buffer) d.foto_clockin = Buffer.from(d.foto_clockin).toString("base64");
      if (d.foto_clockout?.buffer) d.foto_clockout = Buffer.from(d.foto_clockout).toString("base64");
      return d;
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
};


