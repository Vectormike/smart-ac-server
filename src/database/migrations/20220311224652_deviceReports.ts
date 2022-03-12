import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('deviceReports', (t) => {
    t.increments('id');
    t.integer('deviceId');
    t.float('temperature', 2, 2);
    t.float('humidity', 2, 2);
    t.float('carbonMonoxide', 2, 2);
    t.enum('healthStatus', ['OK', 'needs_filter', 'needs_service']);
    t.date('deviceReadingDate');
    t.date('serverReadingDate');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('deviceReports');
}
