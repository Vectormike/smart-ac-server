import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('devices').del();

  // Inserts seed entries
  await knex('devices').insert([
    {
      id: 1,
      serialNumber: '123456789',
      firmwareVersion: '1.0',
      registrationDate: '2022-03-12',
      recentRegistrationDate: '2022-03-13',
    },
    {
      id: 2,
      serialNumber: '234567890',
      firmwareVersion: '1.0',
      registrationDate: '2022-04-11',
      recentRegistrationDate: '2022-04-12',
    },
  ]);
}
