import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import attendanceRoutes from "./routes/attendanceRoutes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (_req, res) =>
  res.json({ status: "ok", service: "attendance-service" })
);


app.use("/api/attendance", attendanceRoutes);

export default app;
