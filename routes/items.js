"use strict";
const express          = require('express');
const router           = express.Router();
const app              = express();
//imdb api
require('dotenv').config();
const imdb             = require('imdb-api');
//Luis dependencies
const request          = require('request');
const querystring      = require('querystring');
const category_Promise = require('../luis/luis.js');
const itemModule       = require('../itemsHelper.js');
const cookieSession    = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ['user_id']
}));

const categories = ['movies/shows', 'restaurants', 'book', 'products', 'None']

module.exports = (knex) => {

    //insert either a relation into users_items in case the item exists
    //or insert a new item into the items table and the relation to the user
    router.post("/", (req, res) => {
        category_Promise(req.body.text_from_user)
            .then(function (data) {
                let topScore = data.intents[0].score;
                let incoming_category_ID = 0;
                if (topScore > 0.2) {
                    let topIntent = data.intents[0].intent;
                    incoming_category_ID = categories.indexOf(topIntent) + 1;
                } else{
                    incoming_category_ID = 5;
                }
                //find item by the text the user entered
                itemModule.findItemByText(req.body.text_from_user)
                .then(function(item){
                    //insert a new item and a new relation
                    if(item.length === 0){
                        itemModule.addNewItem(2, incoming_category_ID, req.body.text_from_user)
                            .then(function() {
                                res.sendStatus(200);
                            }).catch(function (e) {
                                res.status(500).send(e);
                            })
                    } else{
                        //insert a new relation only
                        itemModule.addNewItemRelation(2, item[0].id)
                            .then(function() {
                                res.sendStatus(200);
                            }).catch(function (e) {
                                res.status(500).send(e);
                            })
                    }
                }).catch(function (e) {
                    console.error(e);
                })
            })
    })

    //update item's text or category on table items
    //in case category is zero don't change the category
    //or update the state of an item on the table users_items and send back the
    //resulting state
    router.put('/:id', (req, res) => {
        //update the items table with text_from_user and category
        if (req.body.state === undefined){

            //check if user has changed the category, the id is 0 if he did not
            if (Number(req.body.category_id) === 0) {
                itemModule.updateItemText(req.params.id, req.body.text_from_user)
                    .then(function() {
                        res.sendStatus(200);
                    }).catch(function (e) {
                        res.status(500).send(e);
                    })
            } else {
                itemModule.updateItemTextAndCategory(req.params.id, req.body.category_id, req.body.text_from_user)
                    .then(function() {
                        res.sendStatus(200);
                    }).catch(function (e) {
                        res.status(500).send(e);
                    })
            }
        //update the state on users_items table
        } else {
            //retrieve the current state
            itemModule.findItemState(2, req.params.id)
                .then(function(status) {
                    //depending on the state toggle it
                    if (status[0].state === true) {
                        itemModule.updateState(2, req.params.id, false)
                            .then(function(){
                                res.send(false);
                            }).catch(function (e) {
                                res.status(500).send(e);
                            })
                    } else {
                        itemModule.updateState(2, req.params.id, true)
                            .then(function(){
                                res.send(true);
                            }).catch(function (e) {
                                res.status(500).send(e);
                            })
                    }
                }).catch(function (e) {
                    res.status(500).send(e);
                })
            }
    })

    //delete a user's item from the relation table users_items
    //leaving the item on the items table to be reused
    router.delete('/:id', (req, res) => {
        //console.log(req.cookies["user_id"]);
        itemModule.deleteItemRelation(2, req.params.id)
            .then(function() {
                res.status(200).send(true);
            }).catch(function (e) {
                res.status(500).send(e);
            })
    })

    //get item details for movies
    router.get('/:id/details', (req, res) => {
        itemModule.findItemById(req.params.id)
        .then(function(result) {
                let text = result[0].text_from_user;
                imdb.get(text, {apiKey: process.env.IMDB_KEY, timeout: 3000})
                    .then(function (data) {
                        res.status(200).send(data);
                    })
                    .catch(function (err){
                        res.status(500).send(err);
                    });
            }).catch(function (e) {
                res.status(500).send(e);
            })
    })

    return router;
};