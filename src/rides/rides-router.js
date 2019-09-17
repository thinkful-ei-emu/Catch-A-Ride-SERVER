const express = require('express');
const RidesService = require('./rides-service');

const ridesRouter = express.Router();
const jsonBodyParser = express.json();

ridesRouter
  .route('/')
  
  //get rides available using service from db
  .post((req, res, next) => {
    //take req.body and descturcture, query db to get search results based on body params
    //send back driver id as well to allow for frontend verfication when deleting entire ride

    // RidesService.getSearchedRides(
    //   req.app.get('db'),
    //   startingLoc,
    //   endingLoc,
    // )

    res.status(201).json('post / , send starting and ending from frontend');
  });

ridesRouter
  .route('/driver')


  //get all drivers rides
  .get((req, res, next) => {

    // RidesService.getDriverRides(
    //   req.app.get('db'),
    //   driverId
    // )

    res.status(200).json('get /driver')

  })

  //post driver form and add to rides db
  .post(jsonBodyParser, (req, res, next) => {
    //take req.body and descructure, add into db
    
    
    // take date and convert it into year-month-day
    // var tdate = '01-30-2001';
    // tdate = [tdate.slice(-4), tdate.slice(0,5)].join('-');
    // console.log(tdate)

    // RidesService.addNewDriverRide(
    //   req.app.get('db'),
    //   newRide
    // )

    res.status(201).json('post /driver');
  })

  //take delete request and delete driver's ride from db 
  .delete((req, res, next) => {
  //have to send id in and check id match for driver otherwise dont let delete
  //or have delete be verified frontend by sending driver id from rides list (ref driver id column to user id)
  //if else frontend to allow deletion request to be sent through

    // RidesService.deleteDriverRide(
    //   req.app.get('db'),
    //   ride_id,
    // )
    
    res.status(204);
    //got 204 no content when testing on postman
  });

ridesRouter
  .route('/passenger')

//get passenger specific rides
  .get((req, res, next) => {
    

    // RidesService.getAllPassengerRides(
    //   req.app.get('db'),
    //   pass_id
    // )

    res.status(200).json('get /passenger');
  })

//passenger clicks reserve/add to ride and update db p1, p2, whichever next is null
  .post(jsonBodyParser, (req, res, next) => {

    // let ride = RidessService.getSingleRide(
    //   req.app.get('db'),
    //   ride_id
    // )

    // RidesService.addPassengerToRide(
    //   req.app.get('db'),
    //   updatedRide
    // )

    res.status(201).json('post /passenger');
  })

//passenger clicks delete and update db p1, p2, whichever matches passanger
  .delete((req, res, next) => {

    // let ride = RidessService.getSingleRide(
    //   req.app.get('db'),
    //   ride_id
    // )

    // RidesService.removePassengerFromRide(
    //   req.app.get('db'),
    //   updatedRide
    // )

    res.status(204);
    //got 204 no content when testing on postman
  });

ridesRouter

  //get info for single park
  .route('/:ride_id')
  .get((req, res, next) => {

    // RidesService.getSingleRide(
    //   req.app.get('db'),
    //   req.params.id
    // )
    
    res.status(200).json('single ride');
  });

    

module.exports = ridesRouter;