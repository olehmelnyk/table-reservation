
exports.up = function(knex) {
    return knex.schema.createTable('reservation', function (t) {
        t.increments('id').primary();
        t.integer('table_id').unsigned().index().references('id').inTable('table');
        t.dateTime('reservation_start');
        t.dateTime('reservation_end');
        t.integer('guests');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('reservation')
};
