import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "dexa-wfh",
    time: new Date().toISOString(),
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
