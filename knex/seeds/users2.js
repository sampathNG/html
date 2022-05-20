/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcrypt');
exports.seed = async function(knex) {
  // Deletes ALL existing entries

  await knex('users').del()
  const pass = await bcrypt.hash("Supagrow@123", 10);
  await knex('users').insert([
    {user_id: 1, first_name: 'supagrow',last_name: 'software',email:'s@gmail.com',password: pass}
  ]);
};
