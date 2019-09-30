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
      'id': '8c792a91-d346-4f93-bd77-1c04ddc7ccac',
      'driver_id': '103339967984381402998',
      'starting': 'Blacksburg',
      'destination': 'Virginia Beach',
      'date_time': '2019-09-16 08:00:00',
      'description': '$10 for gas',
      'capacity': 4,
      'p1': '112539454699313514648',
      'p2': null,
      'p3': null,
      'p4': null,
      'p5': null,
      'p6': null,
      'p7': null,
      'driver_name': 'Bob Smith'
    },
    {
      'id': '57bd37c7-7d87-40bc-a691-00f25988f298',
      'driver_id': '103339967984381402998',
      'starting': 'Virginia Beach',
      'destination': 'Blacksburg',
      'date_time': '2019-09-17 14:00:00',
      'description': '$10 for gas, limited trunk space',
      'capacity': 4,
      'p1': '112539454699313514648',
      'p2': '101820519124146512532',
      'p3': null,
      'p4': null,
      'p5': null,
      'p6': null,
      'p7': null,
      'driver_name': 'Bob Smith'
    },
    {
      'id': '64ea927f-441d-40d4-974b-9c79c8c22d1d',
      'driver_id': '112539454699313514648',
      'starting': 'Blacksburg',
      'destination': 'Fairfax',
      'date_time': '2019-09-17 18:00:00',
      'description': 'No charge, hop in',
      'capacity': 5,
      'p1': '103339967984381402998',
      'p2': '101820519124146512532',
      'p3': null,
      'p4': null,
      'p5': null,
      'p6': null,
      'p7': null,
      'driver_name': 'test user'
    },

    {
      'id': 'd72628e3-1ef8-4cd4-b1d0-0db190c6e3c7',
      'driver_id': '112539454699313514648',
      'starting': 'Fairfax',
      'destination': 'Blacksburg',
      'date_time': '2020-09-17 18:00:00',
      'description': 'No charge, hop in',
      'capacity': 5,
      'p1': null,
      'p2': null,
      'p3': null,
      'p4': null,
      'p5': null,
      'p6': null,
      'p7': null,
      'driver_name': 'test user'
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