"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select('*')
      .from('users')
      .where('name', 'Bob')
      .then((results) => {
        res.json(results);
      })
      .catch(function(err){
        console.error(err);
      });
  });

  return router;
}
