"use strict";
const express = require('express');
const router = express.Router();

//Luis dependencies
const request = require('request');
const querystring = require('querystring');
const category_Promise = require('../luis/luis.js');

const categories = ['movies/shows', 'restaurants', 'book', 'products', 'None']

module.exports = (knex) => {

    // use it in insert into users_items
    //insert a movie into the DB
    router.post("/", (req, res) => {
        console.log('in route');
        category_Promise(req.body.text_from_user)
            .then(function (data) {
                let topScore = data.intents[0].score;
                let topIntent = data.intents[0].intent;
                let incoming_category_ID = categories.indexOf(topIntent) + 1;
                //let incoming_category_ID = 2;
                console.log('in promise')
                return knex.insert([{ category_id: incoming_category_ID, text_from_user: req.body.text_from_user }], 'id').into('items')
                    .then(function(newID){
                        console.log('past insert', newID[0]);
                        return knex.insert([{user_id: 2, item_id: newID[0], state: false, date_created: '2018-04-05 18:20:18.387836-04'}]).into("users_items")
                            .then(function(){
                                console.log('insert into users_items');
                                    res.sendStatus(200);
                                }).catch(function (e) {
                                    res.status(500).send(e);
                                })
                            })
                    .catch(function (e) {
                        res.status(500).send(e);
                    })
            })
            .catch(function (e) {
                console.error(e);
            })
    })

    router.put('/:id', (req, res) => {
        return knex('items')
            .where({id: req.params.id})
            .update({text_from_user: req.body.text_from_user})
            .then(function(){
                res.status(200).send(200);
            }).catch(function (e) {
                res.status(500).send(e);
            })
    })

    router.delete('/:id', (req, res) => {
        return knex('items')
            .where({id: req.params.id})
            .del()
            .then(function(){
                res.status(200).send(200);
            }).catch(function (e) {
                res.status(500).send(e);
            })
    })
    return router;
};

// function findItem(text_from_user) {
//     return new Promise(function (resolve, reject) {
//         if (!text_from_user) {
//             return reject("No text_from_user!");
//         } else {

//         }
//     })
// }

