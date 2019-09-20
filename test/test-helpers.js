function makeUsersArray() {
  return [
    { user_id: '103339967984381402998', email: 'bobsmith3175@gmail.com', name: 'Bob Smith' },
    { user_id: '112539454699313514648', email: 'utest6581@gmail.com', name: 'test user' },
    { user_id: '101820519124146512532', email: 'tuser0763@gmail.com', name: 'test User' }
  ];
}

function makeRidesArray() {
  return [
    {
      'id': 1,
      'driver_id': '103339967984381402998',
      'starting': 'Blacksburg',
      'destination': 'Virginia Beach',
      'date': '2019-09-16T07:00:00.000Z',
      'time': '08:00:00',
      'description': '$10 for gas',
      'capacity': 4,
      'p1': '112539454699313514648',
      'p2': null,
      'p3': null,
      'p4': null,
      'p5': null,
      'p6': null,
      'p7': null
    },
    {
      'id': 2,
      'driver_id': '103339967984381402998',
      'starting': 'Virginia Beach',
      'destination': 'Blacksburg',
      'date': '2019-09-17T07:00:00.000Z',
      'time': '14:00:00',
      'description': '$10 for gas, limited trunk space',
      'capacity': 4,
      'p1': '112539454699313514648',
      'p2': '101820519124146512532',
      'p3': null,
      'p4': null,
      'p5': null,
      'p6': null,
      'p7': null
    },
    {
      'id': 3,
      'driver_id': '112539454699313514648',
      'starting': 'Blacksburg',
      'destination': 'Fairfax',
      'date': '2019-09-17T07:00:00.000Z',
      'time': '18:00:00',
      'description': 'No charge, hop in',
      'capacity': 5,
      'p1': '103339967984381402998',
      'p2': '101820519124146512532',
      'p3': null,
      'p4': null,
      'p5': null,
      'p6': null,
      'p7': null
    },

    {
      'id': 4,
      'driver_id': '112539454699313514648',
      'starting': 'Fairfax',
      'destination': 'Blacksburg',
      'date': '2020-09-17T07:00:00.000Z',
      'time': '18:00:00',
      'description': 'No charge, hop in',
      'capacity': 5,
      'p1': null,
      'p2': null,
      'p3': null,
      'p4': null,
      'p5': null,
      'p6': null,
      'p7': null
    }
  ];
}

async function seedUsers(db) {
  await db('users')
    .insert(makeUsersArray());
}

async function seedRides(db){
  await db('rides')
    .insert(makeRidesArray());
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      rides;`
  );
}

module.exports = {
  makeUsersArray,
  makeRidesArray,

  cleanTables,
  seedUsers,
  seedRides,
};