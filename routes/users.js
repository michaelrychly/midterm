"use strict";

const express = require('express');
const router  = express.Router();

const userModule = require('../usersHelper.js');

module.exports = (knex) => {
  //user login button
  router.put("/login", (req, res) => {
    userModule.findUserWithPassword(req.body.username, req.body.password)
      .then((results) => {
        //if not saved in user DB do not allow the user to continue
        //otherwise redirect
        if(results.length === 0){
          res.send([null, false]);
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
    userModule.findUser(req.body.username)
      .then((result) => {
        //if not saved in user DB insert new user
        //otherwise redirect with the existing
        if(result.length === 0){
          userModule.addUser(req.body.username, req.body.password)
            .then(function(){
              res.send([req.body.username, true]);
            })
        } else{
          res.send([null, false]);
          }
      })
      .catch(function(err){
        console.error(err);
      });
  });

  //user logout
  router.put("/logout", (req, res) => {
    //delete the cookie session
    res.sendStatus(200);
  });

  return router;
}
