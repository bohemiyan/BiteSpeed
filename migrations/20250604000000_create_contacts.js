exports.up = function(knex) {
  return knex.schema.createTable('contact', table => {
    table.increments('id').primary();
    table.string('phoneNumber').nullable();
    table.string('email').nullable();
    table.integer('linkedId').nullable().references('id').inTable('contact');
    table.enu('linkPrecedence', ['primary', 'secondary']).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('contact');
};
