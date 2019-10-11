'use strict';

async function createDatabase() {
    const config = require(process.cwd() + '/knexfile');
    config.connection.database = null;
    const knex = require('knex')(config);

    await knex.raw('CREATE DATABASE reservations');
    await knex.destroy();
}

createDatabase();