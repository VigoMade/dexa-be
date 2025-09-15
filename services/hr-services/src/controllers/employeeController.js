import { Op } from "sequelize";
import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";


export const getAllEmployees = async (req, res) => {
  try {
    const { q } = req.query;
    const where = {};

    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { username: { [Op.like]: `%${q}%` } },
        { departement: { [Op.like]: `%${q}%` } },
      ];
    }

    const rows = await Employee.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Error fetching employees", error: e.message });
  }
};

export async function createEmployee(req, res) {
  try {
    const { username, password, name, departement } = req.body || {};

    if (!username || !password || !name || !departement) {
      return res.status(400).json({ message: "username, password, name, dan departement wajib diisi" });
    }


    const exist = await Employee.findByPk(username);
    if (exist) {
      return res.status(409).json({ message: "Username sudah terpakai" });
    }

   
    const hash = await bcrypt.hash(password, 10);

    const row = await Employee.create({
      username,
      password: hash,
      name,
      departement,
      status_employee: "Active",
    });

   
    const { password: _, ...safe } = row.toJSON();
    return res.status(201).json(safe);
  } catch (e) {
    console.error("createEmployee error:", e);
    return res.status(500).json({ message: "Gagal membuat karyawan", error: e.message });
  }
};

export const getEmployeeByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ message: "username wajib diisi" });

    const row = await Employee.findByPk(username);
    if (!row) return res.status(404).json({ message: "Employee tidak ditemukan" });

    return res.json(row);
  } catch (e) {
    return res.status(500).json({ message: "Error fetching employee", error: e.message });
  }
};

export const updateEmployeeByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ message: "username wajib diisi" });

    const row = await Employee.findByPk(username);
    if (!row) return res.status(404).json({ message: "Employee tidak ditemukan" });

    
    const { name, departement, status_employee } = req.body || {};

    let normalizedStatus = status_employee;
    if (typeof status_employee === "string") {
      const s = status_employee.trim().toLowerCase();
      if (s === "active" ) normalizedStatus = "Active";
      else if (s === "inactive") normalizedStatus = "Inactive";
    }

    if (typeof name === "string") row.name = name.trim();
    if (typeof departement === "string") row.departement = departement.trim();
    if (typeof normalizedStatus === "string") row.status_employee = normalizedStatus;

    await row.save();
    return res.json(row);
  } catch (e) {
    return res.status(500).json({ message: "Error updating employee", error: e.message });
  }
};
