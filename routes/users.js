"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  //user login button
  router.put("/login", (req, res) => {
    knex
      .select('*')
      .from('users')
      .where({'name': req.body.username, 'password': req.body.password})
      .then((results) => {
        console.log(results);
        //if not saved in user DB do not allow the user to continue
        //otherwise redirect
        if(result.length === 0){
          res.send(false);
        } else{
          res.send([req.body.username, true]);
        }
      })
      .catch(function(err){
        console.error(err);
      });
  });
  //user register
  router.put("/register", (req, res) => {
    //check if user is already exists
    knex
      .select('*')
      .from('users')
      .where({'name': req.body.username})
      .then((result) => {
        //if not saved in user DB insert new user
        //otherwise redirect with the existing
        if(result.length === 0){
          knex('users')
            .insert({'name': req.body.username,
              'email': req.body.username + '@gmail.com',
              'password': req.body.password})
            .then(function(){
              res.send([req.body.username, true]);
               //res.transfer('/');
            })
        } else{
          res.send(false);
          }
      })
      .catch(function(err){
        console.log("in catch");
        console.error(err);
      });
  });

  return router;
}
