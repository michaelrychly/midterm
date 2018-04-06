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
          let templateVars = {username: req.body.username};

          res.render("/", templateVars);
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
      .where({'name': req.body.username, 'password': req.body.password})
      .then((result) => {
        //if not saved in user DB insert new user
        //otherwise redirect with the existing
        if(result.length === 0){
          knex('users')
            .insert({'name': req.body.username,
              'email': req.body.username + '@gmail.com',
              'password': req.body.password})
            .then(function(){
              let templateVars = {username: req.body.username};
              console.log("in if", templateVars);
              res.render("/", templateVars);
            })
        } else{
          let templateVars = {username: req.body.username};
          console.log("in else", templateVars);
          res.render("/", templateVars);
          }
      })
      .catch(function(err){
        console.log("in catch");
        console.error(err);
      });
  });

  return router;
}
