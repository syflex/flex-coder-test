import { Knex } from 'knex';

/**
 * Migration to create 'habits' and 'habit_completions' tables.
 * This migration assumes a PostgreSQL database for `gen_random_uuid()`.
 * If using a different database, the UUID generation method might need adjustment.
 */
const MIGRATION_NAME = '20240626120000_create_habits_tables';

export async function up(knex: Knex): Promise<void> {
  // Create the 'habits' table
  await knex.schema.createTable('habits', (table) => {
    // Primary Key: UUID for unique identification
    // `gen_random_uuid()` requires the pgcrypto extension in PostgreSQL.
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Foreign Key: Links to a 'users' table, assuming it exists with a UUID primary key.
    // CASCADE ensures habits are deleted if the associated user is deleted.
    table.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index(); // Index for efficient lookup of habits by user

    // Habit Details
    table.string('name', 255).notNullable(); // Habit name, required
    table.text('description'); // Optional longer description

    // Frequency Type: Uses an ENUM-like string constraint for predefined types.
    // 'custom' implies more complex scheduling logic might be handled in the application layer.
    table.enu('frequency_type', ['daily', 'weekly', 'monthly', 'yearly', 'custom'])
      .notNullable()
      .defaultTo('daily');

    table.integer('streak').notNullable().defaultTo(0); // Current streak count, defaults to 0
    table.timestamp('last_completed_date', { useTz: true }); // Last time the habit was completed (nullable)

    // Timestamps for record keeping
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Additional Indexes for query performance
    table.index(['name']); // Useful if habits are searched by name
    table.index(['created_at']); // Useful for chronological sorting/filtering
  });

  // Create the 'habit_completions' table
  await knex.schema.createTable('habit_completions', (table) => {
    // Primary Key: UUID for unique identification
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Foreign Key: Links to the 'habits' table.
    // CASCADE ensures completions are deleted if the associated habit is deleted.
    table.uuid('habit_id')
      .notNullable()
      .references('id')
      .inTable('habits')
      .onDelete('CASCADE')
      .index(); // Index for efficient lookup of completions by habit

    // Completion Timestamp
    table.timestamp('completed_at', { useTz: true }).notNullable().defaultTo(knex.fn.now()); // When the habit was completed

    // Additional Indexes for query performance
    table.index(['completed_at']); // Useful for time-based queries on completions
  });

  console.log(`Migration ${MIGRATION_NAME} UP completed successfully.`);
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order of creation due to foreign key dependencies.
  // `dropTableIfExists` prevents errors if the table doesn't exist.
  await knex.schema.dropTableIfExists('habit_completions');
  await knex.schema.dropTableIfExists('habits');

  console.log(`Migration ${MIGRATION_NAME} DOWN completed successfully.`);
}
