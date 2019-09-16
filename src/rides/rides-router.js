const express = require('express');
const RidesService = require('./rides-service');

const ridesRouter = express.Router();
const jsonBodyParser = express.json();

ridesRouter
  .route('/')
  
  //get rides available using service from db
  .get((req, res, next) => {
    //take req.body and descturcture, query db to get search results based on body params
    //send back driver id as well to allow for frontend verfication when deleting entire ride
    res.status(200).json('get /');
  });

ridesRouter
  .route('/driver')

  //post driver form and add to rides db
  .post(jsonBodyParser, (req, res, next) => {
    //take req.body and descructure, add into db
    res.status(201).json('post /driver');
  })

  //take delete request and delete driver's ride from db 
  .delete((req, res, next) => {
  //have to send id in and check id match for driver otherwise dont let delete
  //or have delete be verified frontend by sending driver id from rides list (ref driver id column to user id)
  //if else frontend to allow deletion request to be sent through

    res.status(204);
    //got 204 no content when testing on postman
  });

ridesRouter
  .route('/passenger')

//get passenger specific rides
  .get((req, res, next) => {
    res.status(200).json('get /passenger');
  })

//passenger clicks reserve/add to ride and update db p1, p2, whichever next is null
  .post(jsonBodyParser, (req, res, next) => {
    res.status(201).json('post /passenger');
  })

//passenger clicks delete and update db p1, p2, whichever matches passanger
  .delete((req, res, next) => {
    res.status(204);
    //got 204 no content when testing on postman
  });

    

module.exports = ridesRouter;