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
      .whereIn('items.category_id', ['2', '5'])
      .orderBy('state', 'desc')
      .then((eat) => {
        let results = {};
        let general = [];
        let items   = [];
        for(let i = 0; i < eat.length; i++)
        {
          if (eat[i].category_id === 5){
            general.push(eat[i]);
          } else {
            items.push(eat[i]);
          }
        }
        results = {general, items};
        res.send(results);
      })
      .catch(function(err){
        console.error(err);
      });
  });

  return router;
}
