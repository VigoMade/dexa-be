import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      algorithms: [process.env.JWT_ALG || "HS256"],
      issuer: process.env.JWT_ISS,
      audience: process.env.JWT_AUD,
    });
  
    req.user = {
      username: payload.sub,
      name: payload.name,
      departement: payload.departement,
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token", error: e.message });
  }
}
