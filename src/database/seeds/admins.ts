import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import env from '../../helpers/env';

let password: string = env.get('ADMIN_PASSWORD');

const hash = bcrypt.hashSync(password, 10);

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('admins').del();

  // Inserts seed entries
  await knex('admins').insert([
    {
      id: 1,
      email: 'nigel@email.com',
      password: hash,
    },
    {
      id: 2,
      email: 'nakaz@email.com',
      password: hash,
    },
    {
      id: 3,
      email: 'jaywon@email.com',
      password: hash,
    },
  ]);
}
