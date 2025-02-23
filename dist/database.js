"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'db_instagram', // Database name
process.env.DB_USER || 'root', // MySQL username
process.env.DB_PASSWORD || '', // MySQL password
{
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
});
exports.default = sequelize;
