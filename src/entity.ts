
import mysql, {Connection, QueryResult} from "mysql2/promise";
import sequelize from "./database";

export default class Entity {
    private m_db: Connection;

    public constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> 
    {
        await this.createDatabase();
        await this.connectDatabase();
        await sequelize.sync({ force: false });
    }

    private async createDatabase(): Promise<void> {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '', 
            port: parseInt(process.env.DB_PORT || '3306')
        });
    
        // Check if the database exists and create it if it doesn't
        const databaseName = process.env.DB_NAME || 'db_instagram';
        await connection.execute<mysql.ResultSetHeader>(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    }

    private async connectDatabase(): Promise<void> {
        // Create a connection pool
        this.m_db = await mysql.createPool({
            host: process.env.DB_HOST|| 'localhost',
            user: process.env.DB_USER|| 'root',
            password: process.env.DB_PASSWORD|| '', 
            port: parseInt(process.env.DB_PORT || '3306'),
            database: process.env.DB_NAME || 'db_instagram',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    
    public async selectQueryList(query: string): Promise<QueryResult> {
        try {
            const [rows] = await this.m_db.query(query);
            return rows;
        } catch(error) {
            return [];
        }
    }

    public async selectQueryInfo(query: string): Promise<any> {
        try {
            const [rows] = await this.m_db.query(query);
            if(rows[0] == undefined)
                return null;
            else
                return rows[0];
        } catch(error) {
            return null;
        }
    }

    public async excuteQuery(query: string): Promise<void> {
        await this.m_db.execute(query);
    }
}
