const RidesService = {

  getAllRides(db) {
    return db('rides')
      .select('*');
  },

  //query db based on search params
  getSearchedRides(db, starting, destination){
    //takes db, starting loc, ending loc

    return db
      .from('rides')
      .select('*')
      .where('starting', 'ILIKE', `%${starting}%`)
      .andWhere('destination', 'ILIKE', `%${destination}%`)
      .limit(10);
  },

  //search with only destination
  getDestinationResultsOnly(db, destination){

    return db
      .from('rides')
      .select('*')
      .where('destination', 'ILIKE', `%${destination}%`);
  },


  //search with only starting
  getStartingResultsOnly(db, starting){

    return db
      .from('rides')
      .select('*')
      .where('starting', 'ILIKE', `%${starting}%`);
  },


  //insert ride from driver form
  addNewDriverRide(db, newRide){
    //takes db, newRide

    return db
      .insert(newRide)
      .into('rides')
      .returning('*')
      .then(([ride]) => ride);
  },


  //remove entire ride
  deleteDriverRide(db, ride_id){
    //takes db, ride_Id
    
    return db
      .from('rides')
      .where('id', ride_id)
      .del();
  },

  //get rides that a driver is driving
  getDriverRides(db, driverId){
    //takes db, driver id

    return db
      .from('rides')
      .select('*')
      .where('driver_id', driverId);

  },


  //get all rides per passenger id
  getAllPassengerRides(db, pass_id){
    //takes db, pass_id

    return db
      .from('rides')
      .select('*')
      .where('p1', pass_id)
      .orWhere({
        p2: pass_id,
      })
      .orWhere({
        p3: pass_id,
      })
      .orWhere({
        p4: pass_id,
      })
      .orWhere({
        p5: pass_id,
      })
      .orWhere({
        p6: pass_id,
      })
      .orWhere({
        p7: pass_id,
      });
  },

  //get single ride by id
  getSingleRide(db, ride_id){
    //takes db and ride_id
    return db
      .from('rides')
      .select('*')
      .where('id', ride_id)
      .first();
  },

  //get emails of passengers of a ride
  getPassEmails(db, ride_id){
    return db
      .select('users.email AS passenger_emails')
      .from('rides')
      .leftJoin('users', function(){
        this.on('users.user_id', '=', 'rides.p1')
          .orOn('users.user_id', '=', 'rides.p2')
          .orOn('users.user_id', '=', 'rides.p3')
          .orOn('users.user_id', '=', 'rides.p4')
          .orOn('users.user_id', '=', 'rides.p5')
          .orOn('users.user_id', '=', 'rides.p6')
          .orOn('users.user_id', '=', 'rides.p7');
      })
      .where('rides.id', ride_id);
  },

  //edit ride
  editRide(db, updatedRide){
    //takes db, updatedRide

    return db
      .from('rides')
      .where('id', updatedRide.id)
      .update(updatedRide);
  },

};

module.exports = RidesService;