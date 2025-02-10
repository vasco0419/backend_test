"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/User.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class Post extends sequelize_1.Model {
}
Post.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    recom_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    recom_users: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    report_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    report_users: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    read_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    read_users: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    image_path: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize: database_1.default,
    tableName: 'tbl_post', // This is the table name
});
exports.default = Post;
