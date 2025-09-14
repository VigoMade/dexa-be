import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";

const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    algorithm: process.env.JWT_ALG || "HS256",
    issuer: process.env.JWT_ISS,
    audience: process.env.JWT_AUD,
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "1h"
  });


const normalizeBcryptHash = (hash) =>
  hash?.startsWith("$2y$") ? "$2b$" + hash.slice(4) : hash;

export const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({ message: "username & password required" });

    const user = await Employee.findByPk(username);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const storedHash = normalizeBcryptHash(user.password);
    const ok = await bcrypt.compare(password, storedHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });


    const payload = {
      sub: user.username,
      name: user.name,
      departement: user.departement
    };
    const accessToken = signAccess(payload);

res.json({
      accessToken,
      token_type: "Bearer",
      expires_in: 60 * 15,
      user: {
        name: user.name,
        departement: user.departement,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Login failed", error: e.message });
  }
};
