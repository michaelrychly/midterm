"use strict";
const express = require('express');
const router = express.Router();

//Luis dependencies
const request = require('request');
const querystring = require('querystring');
const category_Promise = require('../luis/luis.js');

const categories = ['movies/shows', 'restaurants', 'book', 'products', 'None']

module.exports = (knex) => {

    //insert either a relation into users_items in case the item exists
    //or insert a new item into the items table and the relation to the user
    router.post("/", (req, res) => {
        category_Promise(req.body.text_from_user)
            .then(function (data) {
                let topScore = data.intents[0].score;
                let topIntent = data.intents[0].intent;
                let incoming_category_ID = categories.indexOf(topIntent) + 1;
                //find item by the text the user entered
                return knex
                .select("*")
                .from("items")
                .where({text_from_user: req.body.text_from_user})
                .orWhere(({text_from_user: req.body.text_from_user.toLowerCase()}))
                .then(function(item){
                    //insert a new item and a new relation
                    if(item.length === 0){
                        return knex.insert([{ category_id: incoming_category_ID, text_from_user: req.body.text_from_user }], 'id').into('items')
                            .then(function(newID){
                                return knex.insert([{user_id: 2, item_id: newID[0], state: false, date_created: '2018-04-05 18:20:18.387836-04'}]).into("users_items")
                                    .then(function(){
                                            res.sendStatus(200);
                                        }).catch(function (e) {
                                            res.status(500).send(e);
                                        })
                                    })
                            .catch(function (e) {
                                res.status(500).send(e);
                            })
                    } else{
                        //insert a new relation only
                        return knex.insert([{user_id: 2, item_id: item[0].id, state: false, date_created: '2018-04-05 18:20:18.387836-04'}]).into("users_items")
                            .then(function(){
                                res.sendStatus(200);
                            }).catch(function (e) {
                               res.status(500).send(e);
                            })
                        }
                }).catch(function (e) {
                    console.error(e);
                })
            }).catch(function (e) {
                console.error(e);
            })
    })

    //update item's text or category on table items
    //in case category is zero don't change the category
    //or update the state of an item on the table users_items and send back the
    //resulting state
    router.put('/:id', (req, res) => {
        //update the items table with text_from_user and category
        if (Boolean(req.body.state) !== true && Boolean(req.body.state) !== false){
            console.log("in if: ", req.body.state);
            return knex('items')
                .where({id: req.params.id})
                .update({category_id: req.body.category_id, text_from_user: req.body.text_from_user})
                .then(function(ok){
                    console.log("in udpate", ok);
                    //res.send(ok).sendStatus(200);
                }).catch(function (e) {
                    res.status(500).send(e);
                })
        //update the state on users_items table
        } else {
            console.log(req.body.state);
            return knex('users_items')
                .where({user_id: 2, item_id: req.params.id})
                .update({state: req.body.state})
                .then(function(ok){
                    console.log("in udpate", ok);
                    //res.send(ok).sendStatus(200);
                }).catch(function (e) {
                    res.status(500).send(e);
                })
        }
    })

    //delete a user's item from the relation table users_items
    //leaving the item on the items table to be reused
    router.delete('/:id', (req, res) => {
        return knex('users_items')
            .where({user_id: 2, item_id: req.params.id})
            .del()
            .then(function() {
                res.sendStatus(200);
            }).catch(function (e) {
                res.status(500).send(e);
            })
    })
    return router;
};

