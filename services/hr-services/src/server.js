import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4001;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 hr-service running on :${PORT}`));
})();
