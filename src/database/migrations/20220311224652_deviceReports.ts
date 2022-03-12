import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('deviceReports', (t) => {
    t.increments('id');
    t.integer('deviceId');
    t.decimal('temperature', 10, 2);
    t.decimal('humidity', 10, 2);
    t.decimal('carbonMonoxide', 10, 2);
    t.enum('healthStatus', ['OK', 'needs_filter', 'needs_service']);
    t.date('deviceReadingDate');
    t.date('serverReadingDate');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('deviceReports');
}
