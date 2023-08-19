const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/PgService");

module.exports = {
  Item: sequelize.define(
    "item",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      tableName: "item", // Specify the custom table name
      timestamps: true, // Include timestamps (createdAt and updatedAt)
      underscored: true, // Use snake_case for automatically generated fields
    }
  ),
};
