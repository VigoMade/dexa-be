import { Router } from "express";
import { login, adminLogin } from "../controllers/authController.js";


const r = Router();
r.post("/login", login);
r.post("/admin/login", adminLogin); 

export default r;
