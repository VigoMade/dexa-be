import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4002;

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 attendance-service running on port ${PORT}`);
  });
})();
