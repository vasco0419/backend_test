// models/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Admin extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
}

Admin.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'tbl_admin',  // This is the table name
    }
);

export default Admin;