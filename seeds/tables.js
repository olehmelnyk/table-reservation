
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('table').del()
    .then(() => {
      // Inserts seed entries
      return knex('table').insert([
        {number: 1, capacity: 16},
        {number: 2, capacity: 8},
        {number: 3, capacity: 6},
        {number: 4, capacity: 6},
        {number: 5, capacity: 4},
        {number: 6, capacity: 4},
        {number: 7, capacity: 4},
        {number: 8, capacity: 4},
        {number: 9, capacity: 2},
        {number: 10, capacity: 2},
      ]);
    });
};
