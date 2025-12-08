import { DataTypes, Model, type InferCreationAttributes, type InferAttributes } from 'sequelize';
import { sequelize } from '../utils/database.js';

class ReadingList extends Model<
  InferAttributes<ReadingList>,
  InferCreationAttributes<ReadingList>
> {
  declare id: number;
  declare user_id: number;
  declare blog_id: number;
  declare status_read: boolean;
}

ReadingList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    status_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'reading_list',
    tableName: 'reading_list',
    underscored: true,
    timestamps: false,
  }
);

export default ReadingList;
