const express = require('express');
const RidesService = require('./rides-service');
const {requireAuth} = require('../auth/g-auth');
const nodemailer = require('nodemailer');
const NodeGeocoder = require('node-geocoder');
const config = require('../config');

const ridesRouter = express.Router();
const jsonBodyParser = express.json();


ridesRouter
  .route('/')
  .all(requireAuth)
  .get(async (req, res, next) => {
    const rides = await RidesService.getAllRides(req.app.get('db'));

    return res.json(rides);
  })
  //get rides available using service from db
  .post(jsonBodyParser, async (req, res, next) => {
    //take req.body and descturcture, query db to get search results based on body params
    //send back driver id as well to allow for frontend verfication when deleting entire ride

    console.log(req.user);

    if(req.body.hasOwnProperty('starting') === false){
      const {destination} = req.body;
      let rides = await RidesService.getDestinationResultsOnly(
        req.app.get('db'),
        destination
      );

      if(rides.length === 0){
        return res.status(404).json({
          error: 'No Rides Available to this Destination'
        });
      }
      else{
        res.status(201).json(rides);
      }    
    }

    else if(req.body.hasOwnProperty('destination') === false){
      const {starting} = req.body;
      let rides = await RidesService.getStartingResultsOnly(
        req.app.get('db'),
        starting
      );

      if(rides.length === 0){
        return res.status(404).json({
          error: 'No Rides Available From This Starting Location'
        });
      }
      else{
        res.status(201).json(rides);
      }
    }

    else {
      const {starting, destination} = req.body;
      let rides = await RidesService.getSearchedRides(
        req.app.get('db'),
        starting,
        destination,
      );

      if(rides.length === 0){
        return res.status(404).json({
          error: 'No Rides Available From This Starting Location To This Destination'
        });
      }
      else{
        res.status(201).json(rides);
      }
    }
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
      
      //may take this out and just keep sending back an empty [] if run into issues on frontend
      if(driversRides.length === 0){
        return res.status(404).json({
          error: 'You Are Not The Driver Of Any Rides'
        });
      }
      else{
        res.status(200).json(driversRides);
      }
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
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });
    
      newRide.driver_id = req.user.user_id;
    
      // take date and convert it into year-month-day
      // var tdate = '01-30-2001';
      // tdate = [tdate.slice(-4), tdate.slice(0,5)].join('-');
      // console.log(tdate)

      const ride = await RidesService.addNewDriverRide(
        req.app.get('db'),
        newRide
      );

      res.status(201).json(ride);
      
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bobsmith3175@gmail.com',
          pass: 'Plane24235!'
        }
      });

      let mailOptions = {
        from: '"Catch-A-Ride App" <catcharideapp@example.com>',
        to: `${req.user.email}`,
        subject: 'Confirmation',
        text: `Your ride ${ride.starting} to ${ride.destination} that is departing on ${ride.date.toLocaleDateString()} has been posted`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          console.log('Email Sent:' + info.response);
        }
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

      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        ride_id
      );

      if(ride.driver_id !== req.user.user_id){
        res.status(400).json({
          error: 'You Cannot Delete A Ride That You Are Not Driving'
        });
      }
      else{
        await RidesService.deleteDriverRide(
          req.app.get('db'),
          ride_id,
        );

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'bobsmith3175@gmail.com',
            pass: 'Plane24235!'
          }
        });
  
        let mailOptions = {
          from: '"Catch-A-Ride App" <catcharideapp@example.com>',
          to: `${req.user.email}`,
          subject: 'Confirmation',
          text: `Your ride from ${ride.starting} to ${ride.destination} that is departing on ${ride.date.toLocaleDateString()} has been deleted`
        };
  
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error);
          }
          else{
            console.log('Email Sent:' + info.response);
          }
        });

        return res.status(204).end();
        //got 204 no content when testing on postman
      }
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
      
      //may take this out and just keep sending back an empty [] if run into issues on frontend
      if(passengerRides.length === 0){
        return res.status(404).json({
          error: 'You Are Not A Part Of Any Rides'
        });
      }

      else{
        res.status(200).json(passengerRides);
      }
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
      
      let count = 0;

      for(let i = 8; i < updatedRide.length; i++){
        count++;
        if(ride.driver_id === idToAdd){
          res.status(400).json({
            error: 'Driver Cannot Add Themselves As A Passenger'
          });
          break;
        }
        else if(ride.capacity < count){
          res.status(400).json({
            error: 'Max Capacity Reached'
          });
          break;
        }
        else if(ride[updatedRide[i]] === idToAdd){
          res.status(400).json({
            error: 'You Have Already Reserved A Spot In This Ride'
          });
          break;
        }
        else if(ride[updatedRide[i]] === null){
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

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bobsmith3175@gmail.com',
          pass: 'Plane24235!'
        }
      });

      let mailOptions = {
        from: '"Catch-A-Ride App" <catcharideapp@example.com>',
        to: `${req.user.email}`,
        subject: 'Confirmation',
        text: `You have been added to a ride from ${ride.starting} to ${ride.destination} that is departing on ${ride.date.toLocaleDateString()}` 
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          console.log('Email Sent:' + info.response);
        }
      });

      
    }
    catch(e){
      next();
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
      let checkPass = Object.values(ride);

      let idToRemove = req.user.user_id;

      for(let i = 8; i < updatedRide.length; i++){
        if(checkPass.includes(idToRemove) === false){
          res.status(400).json({
            error: 'You Must Be A Part Of This Ride To Remove Yourself'
          });
          break;
        }
        else if(ride[updatedRide[i]] === idToRemove){
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

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bobsmith3175@gmail.com',
          pass: 'Plane24235!'
        }
      });

      let mailOptions = {
        from: '"Catch-A-Ride App" <catcharideapp@example.com>',
        to: `${req.user.email}`,
        subject: 'Confirmation',
        text: `You have been removed from a ride from ${ride.starting} to ${ride.destination} that is departing on ${ride.date.toLocaleDateString()}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          console.log('Email Sent:' + info.response);
        }
      });
    }
    catch(e){
      next();
    }
  });

ridesRouter

  //get info for single park
  .route('/:ride_id')
  .all(requireAuth)
  .get(async (req, res, next) => {

    console.log(req.params.ride_id);

    try{
      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        req.params.ride_id
      );

      if(!ride){
        return res.status(404).json({
          error: 'Ride Does Not Exist'
        });
      }
      else{
        let options = {
          provider: 'google',
          apiKey: config.GEO_API_KEY
        };

        let geocoder = NodeGeocoder(options);

        await geocoder.geocode(`${ride.starting}`)
          .then(res => {
            let obj = res.pop();
            let newObj = {
              lat: obj.latitude,
              long: obj.longitude
            };
            ride.startCoordinates = newObj;
            return ride;
          })
          .catch(err => {
            console.log(err);
          });

        await geocoder.geocode(`${ride.destination}`)
          .then(res => {
            let obj = res.pop();
            let newObj = {
              lat: obj.latitude,
              long: obj.longitude
            };
            ride.destCoordinates = newObj;
            return ride;
          })
          .catch(err => {
            console.log(err);
          });

        res.status(200).json(ride);
      }
    }
    catch(e){
      next();
    }
  });

  

module.exports = ridesRouter;