const { DataTypes, Sequelize } = require('sequelize');

const mininumYear = 1991;

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('blogs', 'year', {
    type: DataTypes.SMALLINT,
    defaultValue: Sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)'),
    allowNull: false,
  });

  await queryInterface.addConstraint('blogs', {
    fields: ['year'],
    type: 'check',
    name: 'year_range_constraint',
    where: Sequelize.literal(`
      year >= ${mininumYear} 
      AND year <= EXTRACT(YEAR FROM CURRENT_DATE)
    `),
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeConstraint('blogs', 'year_range_constraint');
  await queryInterface.removeColumn('blogs', 'year');
}

module.exports = { up, down };
