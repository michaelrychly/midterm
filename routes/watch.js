"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select('*')
      .from('users')
      .innerJoin('users_items', 'users.id', 'user_id')
      .innerJoin('items', 'items.id', 'item_id')
      .where('users.id', '2')
      .whereIn('items.category_id', ['1', '5'])
      .orderBy('state', 'desc')
      .then((watch) => {
        let results = {};
        let general = [];
        let items   = [];
        for(let i = 0; i < watch.length; i++)
        {
          if (watch[i].category_id === 5){
            general.push(watch[i]);
          } else {
            items.push(watch[i]);
          }
        }
        results = {general, items};
        res.send(results);
    });
  });

  return router;
}
