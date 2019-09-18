const express = require('express');
const RidesService = require('./rides-service');
const {requireAuth} = require('../auth/g-auth');
const path = require('path');

const ridesRouter = express.Router();
const jsonBodyParser = express.json();

ridesRouter
  .route('/')
  .all(requireAuth)
  
  //get rides available using service from db
  .post(jsonBodyParser, async (req, res, next) => {
    //take req.body and descturcture, query db to get search results based on body params
    //send back driver id as well to allow for frontend verfication when deleting entire ride

    // if(res.body.starting === null){
    //   const {destination} = req.body
    //   RidesService.getDestinationResultsOnly(
    //     req.app.get('db'),
    //     destination
    //   );
    //   res.status(201).json('destinations only');
    // }

    // else if(res.body.destination === null){
    //   const {starting} = req.body
    //   RidesService.getStartingResultsOnly(
    //     req.app.get('db'),
    //     starting
    //   );
    //   res.status(201).json('starting locations only');
    // };

    // else{
    const {starting, destination} = req.body;
    let rides = await RidesService.getSearchedRides(
      req.app.get('db'),
      starting,
      destination,
    );

    console.log(rides);

    res.status(201).json(rides);
    // }

  });

ridesRouter
  .route('/driver')
  .all(requireAuth)

  //get all drivers rides
  .get( async (req, res, next) => {

    try{

      let driversRides = await RidesService.getDriverRides(
        req.app.get('db'),
        req.user.user_id
      );
      res.status(200).json(driversRides);
    }
    catch(e){
      next();
    }

  })

  //post driver form and add to rides db
  .post(jsonBodyParser, async (req, res, next) => {
    //take req.body and descructure, add into db
    try{

      const {starting, destination, date, time, description, capacity} = req.body;

      newRide = {starting, destination, date, time, description, capacity};

      for (const [key, value] of Object.entries(newRide))
        if (value == null)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });
    
      newRide.driver_id = req.user.user_id;
    
      // take date and convert it into year-month-day
      // var tdate = '01-30-2001';
      // tdate = [tdate.slice(-4), tdate.slice(0,5)].join('-');
      // console.log(tdate)

      await RidesService.addNewDriverRide(
        req.app.get('db'),
        newRide
      )
        .then(ride => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${ride.id}`))
            .json(ride);
        });
    } 
    catch(e){
      next();
    }
   
  })

  //take delete request and delete driver's ride from db 
  .delete(jsonBodyParser, async (req, res, next) => {
  //have to send id in and check id match for driver otherwise dont let delete
  //or have delete be verified frontend by sending driver id from rides list (ref driver id column to user id)
  //if else frontend to allow deletion request to be sent through

    try{
      const {ride_id} = req.body;
      console.log(ride_id);
      await RidesService.deleteDriverRide(
        req.app.get('db'),
        ride_id,
      );
      return res.status(204).end();
      //got 204 no content when testing on postman
    }
    catch(e){
      next();
    }
   
  });

ridesRouter
  .route('/passenger')
  .all(requireAuth)

//get passenger specific rides
  .get( async(req, res, next) => {

    try{
      let passengerRides = await RidesService.getAllPassengerRides(
        req.app.get('db'),
        req.user.user_id
      );
  
      res.status(200).json(passengerRides);
    }
    catch(e){
      next();
    }
    
  })

//passenger clicks reserve/add to ride and update db p1, p2, whichever next is null
  .post(jsonBodyParser, async (req, res, next) => {

    try{
      const {ride_id} = req.body;
      
      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        ride_id
      );

      let updatedRide = Object.keys(ride);
      
      // console.log(updatedRide)

      let idToAdd = req.user.user_id;

      for(let i = 8; i < updatedRide.length; i++){
        if(ride[updatedRide[i]] === null){
          ride[updatedRide[i]] = idToAdd;
          break;
        }
      }

      console.log(ride);

      await RidesService.addPassengerToRide(
        req.app.get('db'),
        ride
      );

      res.status(201).json(ride);

      
    }
    catch(e){
      next()
    }
    
  })

//passenger clicks delete and update db p1, p2, whichever matches passanger
  .delete(jsonBodyParser, async (req, res, next) => {

    try{
      const {ride_id} = req.body;
      
      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        ride_id
      );

      let updatedRide = Object.keys(ride);
      
      // console.log(updatedRide)

      let idToRemove = req.user.user_id;

      for(let i = 8; i < updatedRide.length; i++){
        if(ride[updatedRide[i]] === idToRemove){
          ride[updatedRide[i]] = null;
          break;
        }
      }

      console.log(ride);

      await RidesService.addPassengerToRide(
        req.app.get('db'),
        ride
      );

      res.status(204).end();
      //got 204 no content when testing on postman
    }
    catch(e){
      next();
    }
  });

ridesRouter

  //get info for single park
  .route('/:ride_id')
  .get(async (req, res, next) => {

    console.log(req.params.ride_id)

    try{
      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        req.params.ride_id
      );
    
      res.status(200).json(ride);
    }
    catch(e){
      next();
    }
  });

    

module.exports = ridesRouter;