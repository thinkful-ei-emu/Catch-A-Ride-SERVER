const RidesService = {

  //query db based on search params
  getSearchedRides(){
    //takes db, starting loc, ending loc

    // return db
    //   .from('rides')
    //   .select('*')
    //   .where({
    //     starting_loc: startingLoc,
    //     ending_loc: endingLoc,
    //   });

    // knex('users').where({
    //   first_name: 'Test',
    //   last_name:  'User'
    // }).select('id')
    // Outputs: select `id` from `users` where `first_name` = 'Test' and `last_name` = 'User'
  },


  //insert ride from driver form
  addNewDriverRide(){
    //takes db, newRide

  //   return db
  //     .insert(newRide)
  //     .into('rides')
  //     .returning('*')
  //     .then(([ride]) => ride)
  // },


  //remove entire ride
  deleteDriverRide(){
    //takes db, ride_Id
    
    // return db
    //   .where('id', ride_id)
    //   .del();
  },


  //get all rides per passenger id
  getAllPassengerRides(){
    //takes db, pass_id

    // return db
    //   .from('rides')
    //   .select('*')
    //   .where('p1', pass_id)
    //   .orWhere({
    //     p2: pass_id,
    //   })
    //   .orWhere({
    //     p3: pass_id,
    //   })
    //   .orWhere({
    //     p4: pass_id,
    //   })
    //   .orWhere({
    //     p5: pass_id,
    //   })
    //   .orWhere({
    //     p6: pass_id,
    //   });
  },


  //insert passenger to ride id
  addPassengerToRide(){
    //takes db, updatedRide

    // return db
    //   .from('rides')
    //   .where('id', ride_id)
    //   .update(updatedRide)
  },


  //delete passenger from ride
  removePassengerFromRide(){
    //takes db, updatedRide

    // return db
    //   .from('rides')
    //   .where('id', ride_id)
    //   .update(updatedRide)
  },


  //get single ride by id prolly
  getSingleRide(){
    //takes db and ride_id
    // return db
    //   .from('rides')
    //   .where('id', ride_id)
    //   .first();
  }

};

module.exports = RidesService;