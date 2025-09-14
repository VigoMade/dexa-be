import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Employee = sequelize.define(
  "Employee",
  {
    username: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    departement: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status_employee: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "employees",
    timestamps: false,
  }
);

export default Employee;
