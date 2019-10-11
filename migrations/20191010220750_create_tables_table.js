
exports.up = function(knex) {
    return knex.schema.createTable('table', function (t) {
        t.increments('id').primary();
        t.integer('number').notNullable();
        t.integer('capacity').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('table')
};
