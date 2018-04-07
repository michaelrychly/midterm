const ENV         = process.env.ENV || "development";
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

module.exports = {

  findItemByText: function(text_from_user) {
    return knex
      .select("*")
      .from("items")
      .where({text_from_user: text_from_user})
      .orWhere(({text_from_user: text_from_user.toLowerCase()}))
      .then(function(item){
        return item;
      })
      .catch(function (e) {
        console.error(e);
      })
  },
  findItemById: function(id) {
    return knex
      .select("text_from_user")
      .from("items")
      .where({id: id})
      .then(function(item){
        return item;
      })
      .catch(function (e) {
        console.error(e);
      })
  },
  findItemState: function(user_id, id) {
    return knex
      .select('*')
      .from('users_items')
      .where({user_id: user_id, item_id: id})
      .then(function (state){
        return state;
      })
      .catch(function (e) {
        console.error(e);
      })
  },
  addNewItem: function (user_id, category_Id, text_from_user) {
    return knex.insert([{ category_id: category_Id, text_from_user: text_from_user}], 'id').into('items')
      .then(function(newID){
          return knex.insert([{user_id: user_id, item_id: newID[0], state: false, date_created: new Date()}]).into("users_items")
              .then(function(){
                  }).catch(function (e) {
                      console.error(e);
                  })
              })
      .catch(function (e) {
          console.error(e);
      })
  },
  addNewItemRelation: function (user_id, category_Id) {
    return knex.insert([{user_id: user_id, item_id: category_Id, state: false, date_created: new Date()}]).into("users_items")
      .then(function(){
      }).catch(function (e) {
        console.error(e);
      })
  },
  updateItemText: function(id, text_from_user) {
    return knex('items')
      .where({id: id})
      .update({text_from_user: text_from_user})
      .then(function(){
      }).catch(function (e) {
        console.error(e);
      })
  },
  updateItemTextAndCategory: function(id, category_id, text_from_user) {
    return knex('items')
      .where({id: id})
      .update({category_id: category_id,
              text_from_user: text_from_user})
      .then(function(){
      }).catch(function (e) {
          console.error(e);
      })
  },
  updateState: function(user_id, item_id, state){
    return knex('users_items')
      .where({user_id: user_id, item_id: item_id})
      .update({state: state})
      .then(function(){
      }).catch(function (e) {
          console.error(e);
      })
  },
  deleteItemRelation: function(user_id, item_id){
    return knex('users_items')
      .where({user_id: user_id, item_id: item_id})
      .del()
      .then(function(){
      })
      .catch(function (e) {
          console.error(e);
      })
  }
};