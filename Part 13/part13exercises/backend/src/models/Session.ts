import {
  DataTypes,
  Sequelize,
  Model,
  type InferCreationAttributes,
  type InferAttributes,
  type CreationOptional,
} from 'sequelize';
import { sequelize } from '../utils/database.js';
import User from './User.js';

export default class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare token: string;
  declare created_at: CreationOptional<Date>;
  declare expires_at: Date;

  static async validateTokenState(token: string) {
    const session = await Session.findOne({
      where: {
        token,
      },
      include: [
        {
          model: User,
          as: 'sessionUser',
        },
      ],
    });

    if (!session) return { exists: false as const };

    const now = new Date();

    if (session.expires_at <= now) {
      await session.destroy();
      return false;
    }

    const user = (session as any).sessionUser as User;

    if (user.disabled) {
      await Session.destroy({
        where: {
          user_id: user.id,
        },
      });
      return false;
    }

    return true;
  }
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false, // created_at já foi definido manualmente e a ausência de updated_at pode gerar erros
    modelName: 'session',
  }
);
