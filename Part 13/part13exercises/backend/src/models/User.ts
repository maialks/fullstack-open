import {
  DataTypes,
  Model,
  type InferCreationAttributes,
  type InferAttributes,
  type CreationOptional,
} from 'sequelize';
import { sequelize } from '../utils/database.js';

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare name: string;
  declare password: string;
  declare disabled: CreationOptional<boolean>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'username field can not be empty' },
        len: { args: [3, 32], msg: 'username length must be between 3 and 32 characters long' },
        isEmail: { msg: 'Validation isEmail on username failed' },
      },
    },
    name: {
      type: DataTypes.STRING(16),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'name field can not be empty',
        },
        len: { args: [2, 16], msg: 'first name must be between 2 and 16 characters' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'user',
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  }
);
