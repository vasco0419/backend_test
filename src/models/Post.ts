// models/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Post extends Model {
    public id!: number;
    public user_id!: number;
    public title!: string;
    public description!: string;
    public recom_count!: number;
    public recom_users!: string; //format: [1][2][7]
    public report_count!: number;
    public report_users!: string; //format: [1][2][7]
    public read_count!: number;
    public read_users!: string; //format: [1][2][7]
    public image_path!: string;
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        recom_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        recom_users: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        report_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        report_users: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        read_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        read_users: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image_path: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: 'tbl_post',  // This is the table name
    }
);

export default Post;