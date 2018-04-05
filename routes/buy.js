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
      .whereIn('items.category_id', ['4', '5'])
      .then((buy) => {
        let results = {};
        let general = [];
        let items   = [];
        for(let i = 0; i < buy.length; i++)
        {
          if (buy[i].category_id === 5){
            general.push(buy[i]);
          } else {
            items.push(buy[i]);
          }
        }
        results = {general, items};
        res.send(results);;
    });
  });

  return router;
}
