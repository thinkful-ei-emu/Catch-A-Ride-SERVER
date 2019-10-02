const express = require('express');
const RidesService = require('./rides-service');
const {requireAuth} = require('../auth/g-auth');
const nodemailer = require('nodemailer');
const NodeGeocoder = require('node-geocoder');
const config = require('../config');
const xss = require('xss');

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
    

    //if only destination provided, search by destination only

    if(req.body.hasOwnProperty('starting') === false){
      let {destination} = req.body;
      destination = xss(destination);
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
        return res.status(201).json(rides);
      }    
    }

    //if only starting provided, search by providing 

    else if(req.body.hasOwnProperty('destination') === false){
      let {starting} = req.body;
      starting = xss(starting);
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
        return res.status(201).json(rides);
      }
    }

    //take both starting and destination, and query db
    else {
      let {starting, destination} = req.body;
      starting = xss(starting);
      destination = xss(destination);

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
        return res.status(201).json(rides);
      }
    }
  });

ridesRouter
  .route('/driver')
  .all(requireAuth)

  //get all drivers rides
  .get( async (req, res, next) => {

    try{
      //take user id and match it where user id matches driver id
      let driversRides = await RidesService.getDriverRides(
        req.app.get('db'),
        req.user.user_id
      );
      
      
      if(driversRides.length === 0){
        return res.status(404).json({
          error: 'You Are Not The Driver Of Any Rides'
        });
      }
      else{
        return res.status(200).json(driversRides);
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
    
      let date_time = date.concat(' ', time);

      newRide = {starting, destination, date_time, description, capacity};

      for (const [key, value] of Object.entries(newRide))
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });
    
      newRide.driver_id = req.user.user_id;
      newRide.driver_name = req.user.name;

      newRide = RidesService.serializeRide(newRide);
      //add ride to db through service
      const ride = await RidesService.addNewDriverRide(
        req.app.get('db'),
        newRide
      );
      //email driver saying ride has been created
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
        text: `Your ride ${ride.starting} to ${ride.destination} that is departing on ${ride.date_time.toLocaleDateString()} has been posted`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          console.log('Email Sent:' + info.response);
        }
      });

      return res.status(201).json(ride);

    } 
    catch(e){
      next();
    }
   
  })

  //take delete request and delete driver's ride from db 
  .delete(jsonBodyParser, async (req, res, next) => {

    try{
      const {ride_id} = req.body;

      //get ride by id
      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        ride_id
      );

      //get passenger emails who are a part of the ride
      let passEmails = await RidesService.getPassEmails(
        req.app.get('db'),
        ride_id
      );

      let emails = passEmails.map(email => {
        return email.passenger_emails;
      });
      
      //check if driver id matches user id
      if(ride.driver_id !== req.user.user_id){
        return res.status(400).json({
          error: 'You Cannot Delete A Ride That You Are Not Driving'
        });
      }
      else{
        //delete ride by id
        await RidesService.deleteDriverRide(
          req.app.get('db'),
          ride_id,
        );
        //email driver saying that drive has been deleted
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'bobsmith3175@gmail.com',
            pass: 'Plane24235!'
          }
        });
  
        let mailOptions = {
          from: '"Catch-A-Ride App" <catcharideapp@example.com>',
          to: `${req.user.email}, ${emails.join(', ')}`,
          subject: 'Confirmation',
          text: `Your ride from ${ride.starting} to ${ride.destination} that is departing on ${ride.date_time.toLocaleDateString()} has been cancelled`
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
        
      }
    }
    catch(e){
      console.log(e.message);
      next();
    }
   
  });

ridesRouter
  .route('/passenger')
  .all(requireAuth)

//get passenger specific rides
  .get( async(req, res, next) => {

    try{
      //get rides that a user is passenger in
      let passengerRides = await RidesService.getAllPassengerRides(
        req.app.get('db'),
        req.user.user_id
      );
      
      if(passengerRides.length === 0){
        return res.status(404).json({
          error: 'You Are Not Riding In Any Rides'
        });
      }

      else{
        return res.status(200).json(passengerRides);
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
      

      let idToAdd = req.user.user_id;
      
      let count = 0;
      
      for(let i = 6; i < updatedRide.length; i++){
        count++;
        //check if driver is trying to add themselves
        if(ride.driver_id === idToAdd){
          return res.status(400).json({
            error: 'Driver Cannot Add Themselves As A Passenger'
          });
        }
        //check if ride is full
        else if(ride.capacity < count){
          return res.status(400).json({
            error: 'Max Capacity Reached'
          });
        }
        //check if user is already a passenger in the ride
        else if(ride[updatedRide[i]] === idToAdd){
          return res.status(400).json({
            error: 'You Have Already Reserved A Spot In This Ride'
          });
        }
        //if passes other verifications, add user to ride
        else if(ride[updatedRide[i]] === null){
          ride[updatedRide[i]] = idToAdd;
          break;
        }
      }
      //make changes to ride using service
      await RidesService.editRide(
        req.app.get('db'),
        ride
      );

      //send email to user saying that they have been added to ride
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
        text: `You have been added to a ride from ${ride.starting} to ${ride.destination} that is departing on ${ride.date_time.toLocaleDateString()}` 
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          console.log('Email Sent:' + info.response);
        }
      });

      return res.status(201).json(ride);
      
    }
    catch(e){
      console.error(e.message);
      next();
    }
    
  })

//passenger clicks delete and update db p1, p2, whichever matches passanger
  .patch(jsonBodyParser, async (req, res, next) => {

    try{
      const {ride_id} = req.body;
      
      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        ride_id
      );

      let updatedRide = Object.keys(ride);
      
      
      let checkPass = Object.values(ride);

      let idToRemove = req.user.user_id;

      for(let i = 6; i < updatedRide.length; i++){
        //check if user is a part of the ride
        if(checkPass.includes(idToRemove) === false){
          return res.status(400).json({
            error: 'You Must Be A Part Of This Ride To Remove Yourself'
          });
        }
        //if passing other validation, allow removal of user from ride
        else if(ride[updatedRide[i]] === idToRemove){
          ride[updatedRide[i]] = null;
          break;
        }
      }

      //edit ride using service
      await RidesService.editRide(
        req.app.get('db'),
        ride
      );

      //send email letting passenger know that they have left the ride
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
        text: `You have been removed from a ride from ${ride.starting} to ${ride.destination} that is departing on ${ride.date_time.toLocaleDateString()}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          console.log('Email Sent:' + info.response);
        }
      });

      return res.status(200).json({
        message: 'You have left this ride'
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

    try{
      let ride_id = req.params.ride_id;
      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        ride_id
      );

      if(!ride){
        return res.status(404).json({
          error: 'Ride Does Not Exist'
        });
      }
      else{
        //send back coordinates of starting location and destination
        let options = {
          provider: 'google',
          apiKey: config.GEO_API_KEY
        };

        let geocoder = NodeGeocoder(options);

        await geocoder.geocode(`${ride.starting}`)
          .then(res => {
            let obj = res.pop();
            ride.startCoorLat = obj.latitude;
            ride.startCoorLong = obj.longitude;
            return ride;
          })
          .catch(err => {
            console.log(err);
          });

        await geocoder.geocode(`${ride.destination}`)
          .then(res => {
            let obj = res.pop();
            ride.destCoorLat = obj.latitude;
            ride.destCoorLong = obj.longitude;
            return ride;
          })
          .catch(err => {
            console.log(err);
          });

        //send response including ride + coordinates
        return res.status(200).json(ride);
      }
    }
    catch(e){
      console.error(e.message);
      //check if ride id is valid
      res.status(400).json({
        error: 'Invalid ride_id'
      });
      next();
    }
  })
  
  //allow driver to edit their ride details using param ride_id
  .patch(jsonBodyParser, async(req, res, next) => {
    try{
      let ride_id = req.params.ride_id;
      let ride = await RidesService.getSingleRide(
        req.app.get('db'),
        ride_id
      );
      
      //validate if user is the driver
      if(req.user.user_id !== ride.driver_id){
        return res.status(400).json({
          error: 'You must be driving this ride to edit the description'
        });
      }

      else{
        const { starting, destination, description, date, time } = req.body;
        
        let checkDate = new Date(date);

        //validate date
        if(checkDate.toString() === 'Invalid Date'){
          return res.status(400).json({
            error: 'Enter a valid date'
          });
        }
        let checkHour = Number(time.split(':')[0]);
        let checkMin = Number(time.split(':')[1].split(' ')[0]);

        //validate time
        if(checkHour > 12 
        || checkHour < 1 
        || checkMin > 59 
        || checkMin < 0
        || isNaN(checkMin) === true){
          return res.status(400).json({
            error: 'Enter a valid time'
          });
        }
        
        let date_time = new Date(date.concat(' ', time));

        const updateRide = {starting, destination, description, date_time};

        let arr = Object.keys(updateRide);

        for (let i = 0; i < arr.length; i++){
          if(updateRide[arr[i]] !== undefined){
            ride[arr[i]] = updateRide[arr[i]];
          }
        }

        ride = RidesService.serializeRide(ride);
        
        //edit ride using service
        await RidesService.editRide(
          req.app.get('db'),
          ride
        );

        let passEmails = await RidesService.getPassEmails(
          req.app.get('db'),
          ride_id
        );
    
        let emails = passEmails.map(email => {
          return email.passenger_emails;
        });

        //send emails to driver and passengers saying that the ride has been edited
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'bobsmith3175@gmail.com',
            pass: 'Plane24235!'
          }
        });
  
        let mailOptions = {
          from: '"Catch-A-Ride App" <catcharideapp@example.com>',
          to: `${req.user.email}, ${emails.join(', ')}`,
          subject: 'There Have Been Some Changes To Your Upcoming Ride',
          text: 'Your upcoming ride has had changes made to it. Please check your dashboard to see what changes have been made and to see if you can still "CATCH-A-RIDE" !'
        };
  
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error);
          }
          else{
            console.log('Email Sent:' + info.response);
          }
        });

        //send back coordinates of starting location and destination
        let options = {
          provider: 'google',
          apiKey: config.GEO_API_KEY
        };
  
        let geocoder = NodeGeocoder(options);
  
        await geocoder.geocode(`${ride.starting}`)
          .then(res => {
            let obj = res.pop();
            ride.startCoorLat = obj.latitude;
            ride.startCoorLong = obj.longitude;
            return ride;
          })
          .catch(err => {
            console.log(err);
          });
  
        await geocoder.geocode(`${ride.destination}`)
          .then(res => {
            let obj = res.pop();
            ride.destCoorLat = obj.latitude;
            ride.destCoorLong = obj.longitude;
            return ride;
          })
          .catch(err => {
            console.log(err);
          });
  
        return res.status(201).json(ride);
      }

    }
    catch(e){
      console.error(e.message);
      next();
    }
  });

  

module.exports = ridesRouter;