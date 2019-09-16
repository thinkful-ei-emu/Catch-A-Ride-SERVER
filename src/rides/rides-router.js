const express = require('express');
const RidesService = require('./rides-service');

const ridesRouter = express.Router();
const jsonBodyParser = express.json();

ridesRouter
  .route('/')
  
  //get rides available using service from db
  .get((req, res, next) => {
    //take req.body and descturcture, query db to get search results based on body params
    res.status(200).json();
  });

ridesRouter
  .route('/driver')

  //post driver form and add to rides db
  .post(jsonBodyParser, (req, res, next) => {
    //take req.body and descructure, add into db
    res.status(201);
  })

  //take delete request and delete driver's ride from db 
  .delete((req, res, next) => {

    res.status(204);
  });

ridesRouter
  .route('/passenger')

//get passenger specific rides
  .get((req, res, next) => {
    res.status(200).json();
  })

//passenger clicks reserve/add to ride and update db p1, p2, whichever next is null
  .post(jsonBodyParser, (req, res, next) => {
    res.status(201);
  })

//passenger clicks delete and update db p1, p2, whichever matches passanger
  .delete((req, res, next) => {
    res.status(204);
  });

    