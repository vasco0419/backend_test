"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const database_1 = __importDefault(require("./database"));
class Entity {
    constructor() {
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createDatabase();
            yield this.connectDatabase();
            yield database_1.default.sync({ force: false });
        });
    }
    createDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield promise_1.default.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                port: parseInt(process.env.DB_PORT || '3306')
            });
            // Check if the database exists and create it if it doesn't
            const databaseName = process.env.DB_NAME || 'db_instagram';
            yield connection.execute(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
        });
    }
    connectDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a connection pool
            this.m_db = yield promise_1.default.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                port: parseInt(process.env.DB_PORT || '3306'),
                database: process.env.DB_NAME || 'db_instagram',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        });
    }
    selectQueryList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.m_db.query(query);
                return rows;
            }
            catch (error) {
                return [];
            }
        });
    }
    selectQueryInfo(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.m_db.query(query);
                if (rows[0] == undefined)
                    return null;
                else
                    return rows[0];
            }
            catch (error) {
                return null;
            }
        });
    }
    excuteQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.m_db.execute(query);
        });
    }
}
exports.default = Entity;
