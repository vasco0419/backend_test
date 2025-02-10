// models/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Comment extends Model {
    public id!: number;
    public user_id!: number;
    public post_id!: number;
    public description!: string;
}

Comment.init(
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
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'tbl_comment',  // This is the table name
    }
);

export default Comment;