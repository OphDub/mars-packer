exports.seed = function(knex, Promise) {
  return knex('items').del()
  .then(() => {
    return Promise.all([
      knex('items').insert([
        { name: 'My Macbook', status: 'packed' },
        { name: 'Coffee', status: 'not packed'}
      ],'id')
    ])
    .then()
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};