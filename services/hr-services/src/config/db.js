import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      timezone: "+07:00"
    }
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL connected to database: ${process.env.DB_NAME}`);
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
}
