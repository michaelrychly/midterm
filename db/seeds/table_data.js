exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({name: 'Alice', email: "Alice@gmail.com", password: "test"}),
        knex('users').insert({name: 'Bob', email: "Bob@gmail.com", password: "test"}),
        knex('users').insert({name: 'Charlie', email: "Charlie@gmail.com", password: "test"})
      ]);
    })
    .then(function() {
        return knex('categories').del();
      })
    .then(function () {
      return Promise.all([
        knex('categories').insert({name: 'Film'}),
        knex('categories').insert({name: 'Restaurant'}),
        knex('categories').insert({name: 'Books'}),
        knex('categories').insert({name: 'Products'}),
        knex('categories').insert({name: 'General'})
      ]);
    })
    .then(function() {
        return knex('items').del();
      })
    .then(function () {
      return Promise.all([
         knex('items').insert({category_id: '1', text_from_user: 'Star Wars', details:''}),
         knex('items').insert({category_id: '1', text_from_user: 'Star Trek', details:''}),
         knex('items').insert({category_id: '1', text_from_user: 'Pulp Fiction', details:''}),
         knex('items').insert({category_id: '1', text_from_user: 'Fight Club', details:''}),
         knex('items').insert({category_id: '1', text_from_user: 'Forrest Gump', details:''}),
         knex('items').insert({category_id: '2', text_from_user: 'Italian', details:''}),
         knex('items').insert({category_id: '2', text_from_user: 'Greek', details:''}),
         knex('items').insert({category_id: '2', text_from_user: 'Spanish', details:''}),
         knex('items').insert({category_id: '2', text_from_user: 'Mexican', details:''}),
         knex('items').insert({category_id: '2', text_from_user: 'French', details:''}),
         knex('items').insert({category_id: '3', text_from_user: 'Harry Potter', details:''}),
         knex('items').insert({category_id: '3', text_from_user: 'Animal Farm', details:''}),
         knex('items').insert({category_id: '3', text_from_user: 'The Lord of the Rings', details:''}),
         knex('items').insert({category_id: '3', text_from_user: 'The Davinci Code', details:''}),
         knex('items').insert({category_id: '3', text_from_user: 'Romeo and Juliet', details:''}),
         knex('items').insert({category_id: '4', text_from_user: 'Shoes', details:''}),
         knex('items').insert({category_id: '4', text_from_user: 'Galaxy S9', details:''}),
         knex('items').insert({category_id: '4', text_from_user: 'T-Shirt', details:''}),
         knex('items').insert({category_id: '4', text_from_user: 'Flatscreen TV', details:''}),
         knex('items').insert({category_id: '4', text_from_user: 'Make-up', details:''}),
         knex('items').insert({category_id: '5', text_from_user: 'This', details:''}),
         knex('items').insert({category_id: '5', text_from_user: 'That', details:''}),
         knex('items').insert({category_id: '5', text_from_user: 'Example', details:''}),
         knex('items').insert({category_id: '5', text_from_user: 'Blahh', details:''}),
         knex('items').insert({category_id: '5', text_from_user: 'Foobar', details:''})
      ]);
    })
    .then(function() {
        return knex('users_items').del();
      })
    .then(function () {
      return Promise.all([
        knex('users_items').insert({user_id: 1, item_id: 1, state: true}),
        knex('users_items').insert({user_id: 1, item_id: 2, state: false}),
        knex('users_items').insert({user_id: 1, item_id: 4, state: false}),
        knex('users_items').insert({user_id: 1, item_id: 6, state: false}),
        knex('users_items').insert({user_id: 1, item_id: 8, state: false}),
        knex('users_items').insert({user_id: 1, item_id: 13, state: true}),
        knex('users_items').insert({user_id: 1, item_id: 14, state: false}),
        knex('users_items').insert({user_id: 1, item_id: 17, state: false}),
        knex('users_items').insert({user_id: 1, item_id: 20, state: false}),
        knex('users_items').insert({user_id: 1, item_id: 25, state: false}),
        knex('users_items').insert({user_id: 2, item_id: 2, state: true}),
        knex('users_items').insert({user_id: 2, item_id: 3, state: false}),
        knex('users_items').insert({user_id: 2, item_id: 4, state: false}),
        knex('users_items').insert({user_id: 2, item_id: 7, state: false}),
        knex('users_items').insert({user_id: 2, item_id: 9, state: false}),
        knex('users_items').insert({user_id: 2, item_id: 14, state: true}),
        knex('users_items').insert({user_id: 2, item_id: 15, state: false}),
        knex('users_items').insert({user_id: 2, item_id: 18, state: false}),
        knex('users_items').insert({user_id: 2, item_id: 21, state: false}),
        knex('users_items').insert({user_id: 2, item_id: 25, state: false})
      ]);
    })
};