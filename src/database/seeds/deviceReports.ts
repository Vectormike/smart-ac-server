import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('deviceReports').del();

  // Inserts seed entries
  await knex('deviceReports').insert([
    {
      id: 1,
      deviceId: 1,
      temperature: 100.0,
      humidity: 100.0,
      carbonMonoxide: 100.0,
      healthStatus: 'Ok',
    },
    {
      id: 2,
      deviceId: 2,
      temperature: 100.0,
      humidity: 100.0,
      carbonMonoxide: 100.0,
      healthStatus: 'Ok',
    },
  ]);
}
