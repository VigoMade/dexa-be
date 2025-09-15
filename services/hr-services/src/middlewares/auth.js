import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing Bearer token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      algorithms: [process.env.JWT_ALG || "HS256"],
      issuer: process.env.JWT_ISS,
      audience: process.env.JWT_AUD,
      clockTolerance: 5,
    });
    req.user = payload; 
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid/expired token" });
  }
}


export function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
