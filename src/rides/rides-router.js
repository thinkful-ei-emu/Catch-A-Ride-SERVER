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

    // if(!res.body.startingLoc === null){
    //   const {destination} = req.body
    //   RidesService.getDestinationResultsOnly(
    //     req.app.get('db'),
    //     destination
    //   );
    //   res.status(201).json('destinations only');
    // }

    // else if(!res.body.destination === null){
    //   const {starting} = req.body
    //   RidesService.getStartingResultsOnly(
    //     req.app.get('db'),
    //     starting
    //   );
    //   res.status(201).json('starting locations only');
    // };

    // else{
    // const {starting, location} = req.body;
    // RidesService.getSearchedRides(
    //   req.app.get('db'),
    //   starting,
    //   destination,
    // );
    // res.status(201).json('post / , send starting and ending from frontend');
    // }

  });

ridesRouter
  .route('/driver')

  //get all drivers rides
  .get((req, res, next) => {

    // RidesService.getDriverRides(
    //   req.app.get('db'),
    //   req.user.id
    // )

    res.status(200).json('get /driver and drivers rides');

  })

  //post driver form and add to rides db
  .post(jsonBodyParser, (req, res, next) => {
    //take req.body and descructure, add into db
    
    // const {starting, destination, date, time, description, capacity} = req.body;

    // newRide = {starting, destination, date, time, description, capacity}

    // for (const [key, value] of Object.entries(newRide))
    //   if (value == null)
    //     return res.status(400).json({
    //       error: `Missing '${key}' in request body`
    //     });
    
    // newRide.driver_id = req.user.id;
    
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

    // const {ride_id} = req.body;
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
    //   req.user.id
    // )

    res.status(200).json('get /passenger');
  })

//passenger clicks reserve/add to ride and update db p1, p2, whichever next is null
  .post(jsonBodyParser, (req, res, next) => {

    // const {ride_id} = req.body;

    // let ride = RidessService.getSingleRide(
    //   req.app.get('db'),
    //   ride_id
    // )

    // take ride object and transfer data into updated ride with next p1, 2, 3, changed to id and not null
    // let updatedRide = {}

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

    //find passenger id amount p1, 2, 3, etc, and set it to null
    // let updatedRide = {}

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