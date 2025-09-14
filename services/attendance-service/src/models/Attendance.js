import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Attendance = sequelize.define(
  "Attendance",
  {
    id_absen: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    nama_karyawan: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    clockin_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    clockout_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    foto_clockin: {
      type: DataTypes.BLOB("medium"),
      allowNull: false,
    },
    foto_clockout: {
      type: DataTypes.BLOB("medium"),
      allowNull: true,
    },
    catatan: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "absensi_wfh", 
    timestamps: false,
  }
);

export default Attendance;
