exports.up = (knex) =>
  knex.schema.createTable('products', (table) => {
    table.increments('id');
    table.text('title').notNullable();
    table.decimal('costPrice').notNullable();
    table.decimal('salePrice').notNullable();
    table.text('category').notNullable();
    table.integer('quantity').notNullable();
  });

exports.down = (knex) => knex.schema.dropTable('products');
