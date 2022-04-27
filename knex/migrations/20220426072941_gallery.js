/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function(table) {
        table.increments("user_id").primary();
        table.string('first_name');
        table.string('last_name');
        table.string('email');
        table.string('password');
        // table.string('role').defaultTo('user');
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
    .createTable('testimonial', function(table) {
        table.increments("id").primary();
        table.string('title');
        table.string('image');
        table.string('description');
        table.string('status');
        table.string('created_by');
        table.string('updated_by');
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
    .createTable('gallery', function(table) {
        table.increments("id").primary();
        table.string('image');
        table.string('status');
        table.string('created_by');
        table.string('updated_by');
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('gallery');
};
