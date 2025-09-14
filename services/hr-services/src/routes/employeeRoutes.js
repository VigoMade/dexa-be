import { Router } from "express";
import auth from "../middlewares/auth.js";
import Employee from "../models/Employee.js";

const r = Router();

r.get("/", auth, async (_req, res) => {
  try {
    const rows = await Employee.findAll({ order: [["created_at", "DESC"]] });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Error fetching employees", error: e.message });
  }
});

export default r;
