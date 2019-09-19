const {google} = require('googleapis');
const config = require('../src/config');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

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
      'driver_id': '113938795112280626788',
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
      'driver_id': '113938795112280626788',
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
      'driver_id': '103339967984381402998',
      'starting': 'Blacksburg',
      'destination': 'Fairfax',
      'date': '2019-09-17T07:00:00.000Z',
      'time': '18:00:00',
      'description': 'No charge, hop in',
      'capacity': 5,
      'p1': '113938795112280626788',
      'p2': '101820519124146512532',
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
  seedUsers
};