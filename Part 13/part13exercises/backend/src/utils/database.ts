import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import config from './config.js';

export const sequelize = new Sequelize(config.DATABASE_URI, {
  dialect: 'postgres',
  logging: !(config.NODE_ENV === 'production'),
});

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.cjs',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  const migrations = await migrator.up();
  console.log('migrations up to date', {
    files: migrations.map((migration) => migration.name),
  });
};

export const connectToDabase = async function () {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('connected to db');
  } catch (error: unknown) {
    console.log(error);
    console.log('failed to connect to the database');
    process.exit(1);
  }
};
