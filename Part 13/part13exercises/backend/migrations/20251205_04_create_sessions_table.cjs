const { DataTypes, Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('sessions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE, // no Postgres vira TIMESTAMPTZ
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('sessions');
}

module.exports = { up, down };
