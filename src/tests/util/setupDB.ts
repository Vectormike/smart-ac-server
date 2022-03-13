import * as ORM from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const knex = ORM.knex({
  client: 'mysql2',
  connection: {
    database: process.env.TEST_DB_NAME,
    user: process.env.TEST_DB_USERNAME,
    port: Number(process.env.TEST_DB_PORT),
    host: process.env.TEST_DB_HOST,
    password: process.env.TEST_DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    loadExtensions: ['.ts'],
    extension: 'ts',
    tableName: 'knex_migrations',
    directory: __dirname + '../../../database/migrations',
  },
  seeds: {
    directory: __dirname + '../../../database/seeds',
  },
});

const setupTestDB = () => {
  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  }, 30000);

  afterAll(async () => {
    await knex.migrate.rollback();
  }, 30000);
};

export default setupTestDB;
