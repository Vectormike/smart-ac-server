import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('devices', (t) => {
    t.increments('id');
    t.string('serialNumber');
    t.string('firmwareVersion');
    t.date('registrationDate');
    t.date('recentRegistrationDate');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('devices');
}
