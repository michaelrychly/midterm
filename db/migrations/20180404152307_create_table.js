exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function (table) {
      table.string('email');
      table.string('password');
    })
    .then(function() {
      return knex.schema.createTableIfNotExists('categories', function (table) {
        table.increments().primary;
        table.string('name');
    })})
    .then(function() {
      return knex.schema.createTableIfNotExists('items', function (table) {
        table.increments().primary;
        table.string('text_from_user');
        table.integer('category_id');
        table.foreign('category_id').references('categories.id');
        table.string('details').nullable();
    })})
    .then(function() {
      return knex.schema.createTableIfNotExists('users_items', function (table) {
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id');
        table.integer('item_id').unsigned();
        table.foreign('item_id').references('items.id');
        table.boolean('state');
        table.timestamp('date_created').defaultTo(knex.fn.now());
    })});
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function (table) {
    table.dropColumn('email');
    table.dropColumn('password');
  })
  .then(function() {
    return knex.schema.dropTableIfExists('users_items');
    })
  .then(function() {
    return knex.schema.dropTableIfExists('items');
    })
  .then(function() {
    return knex.schema.dropTableIfExists('categories');
  });
};
