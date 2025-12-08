import {
  DataTypes,
  Model,
  type InferCreationAttributes,
  type InferAttributes,
  type CreationOptional,
  Sequelize,
} from 'sequelize';
import { sequelize } from '../utils/database.js';

export default class Blog extends Model<InferAttributes<Blog>, InferCreationAttributes<Blog>> {
  declare id: number;
  declare author: CreationOptional<string>;
  declare url: string;
  declare title: string;
  declare likes: number;
  declare year: number;
  declare publisherId: CreationOptional<number>;
}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.SMALLINT,
      defaultValue: Sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)'),
      validate: {
        validYear(value: number) {
          const current = new Date().getFullYear();
          if (value < 1991 || value > current) {
            throw new Error(`year must be between 1991 and ${current}`);
          }
        },
      },
    },
    publisherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog',
  }
);
