const ENV         = process.env.ENV || "development";
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

module.exports = {

  findUser: function(username) {
    return knex
      .select('*')
      .from('users')
      .where({'name': username})
      .then(function(user){
        return user;
      })
      .catch(function (e) {
        console.error(e);
      })
  },
  findUserWithPassword: function(username, password) {
    return knex
      .select('*')
      .from('users')
      .where({'name': username, 'password': password})
      .then(function(user){
        return user;
      })
      .catch(function (e) {
        console.error(e);
      })
  },
  addUser: function(username, password) {
    return knex.insert([{'name': username,
              'email': username + '@gmail.com',
              'password': password}], 'id').into('users')
      .then(function (){
      })
      .catch(function (e) {
        console.error(e);
      })
  }
};