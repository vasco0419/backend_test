import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME || 'db_instagram',    // Database name
    process.env.DB_USER || 'root',            // MySQL username
    process.env.DB_PASSWORD || '',            // MySQL password
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
    }
);

export default sequelize;