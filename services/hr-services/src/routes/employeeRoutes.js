import { Router } from "express";
import auth from "../middlewares/auth.js";
import { getAllEmployees, createEmployee, getEmployeeByUsername , updateEmployeeByUsername} from "../controllers/employeeController.js";

const r = Router();

r.get("/", auth, getAllEmployees);
r.post("/", auth,createEmployee);
r.get("/:username", auth, getEmployeeByUsername); 
r.put("/:username", auth, updateEmployeeByUsername);

export default r;
