import { DataTypes, Model } from "sequelize";
import sequelize from "./pool.ts";
import type { User } from "../../modules/users/types/user.types.ts";

type UserAttributes = Omit<User, 'id'>

const Users = sequelize.define<Model<User, UserAttributes>>('users', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING
    },
    birthDate: {
        type: DataTypes.DATE
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'blocked'),
        defaultValue: 'inactive'
    }
});

export default Users;