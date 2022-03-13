import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('tokens').del();

  // Inserts seed entries
  await knex('tokens').insert([
    {
      id: 1,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJpYWxOdW1iZXIiOiIxMjM0NTY3ODkiLCJzaGFyZWRTZWNyZXQiOiJ0aGVvcmVtIiwiaWF0IjoxNjQ3MDgxNzU1LCJleHAiOjE2NDcxNjgxNTV9._vguIk7-9VQzbqyQzQVDp0UvhdGqVKogsBvpjBBEEMk',
      deviceId: 1,
    },
  ]);
}
