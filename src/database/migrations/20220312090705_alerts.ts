import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('alerts', (t) => {
    t.increments('id');
    t.string('serialNumber');
    t.string('alert');
    t.date('alertDate');
    t.date('resolveDate');
    t.integer('deviceReportId');
    t.enum('viewState', ['new', 'viewed']);
    t.enum('resolved', ['new', 'viewed', 'ignored']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('alerts');
}
