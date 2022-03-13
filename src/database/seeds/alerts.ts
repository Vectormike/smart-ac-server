import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('alerts').del();

  // Inserts seed entries
  await knex('alerts').insert([
    {
      id: 1,
      serialNumber: '123456789',
      alert: 'Sensor temperature has value out of range',
      alertDate: '2020-2-2',
      resolveDate: '2020-2-2',
      deviceReportId: 1,
      viewState: 'new',
      resolved: 'new',
    },
    {
      id: 2,
      serialNumber: '123356749',
      alert: 'Sensor humidity has value out of range',
      alertDate: '2020-2-2',
      resolveDate: '2020-2-2',
      deviceReportId: 2,
      viewState: 'new',
      resolved: 'new',
    },
  ]);
}
