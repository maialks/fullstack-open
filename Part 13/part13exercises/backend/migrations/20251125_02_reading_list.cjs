const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('reading_list', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    blog_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'blogs',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    status_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('reading_list');
}

module.exports = { up, down };
