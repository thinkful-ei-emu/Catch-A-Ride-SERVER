const knex = require('knex');
const config = require('../src/config');

const app = require('../src/app');
const helpers = require('./test-helpers');


//all tests done using Bob Smith Dummy Account
describe('Rides Endpoints', () => {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testRides = helpers.makeRidesArray();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });

    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('/api/rides routes', () => {
    describe('POST /api/rides', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });
      it('should return the ride based on search params with both starting and destination', () => {
        const testSearch = {
          starting: testRides[0].starting,
          destination: testRides[0].destination,
        };

        return supertest(app)
          .post('/api/rides')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(testSearch)
          .expect(201)
          .expect(res => {
            expect(res.body[0]).to.have.property('id');
            expect(res.body[0]).to.have.property('driver_id');
            expect(res.body[0]).to.have.property('driver_name');
            expect(res.body[0].starting).to.eql(testRides[0].starting);
            expect(res.body[0].destination).to.eql(testRides[0].destination);
            expect(res.body[0].description).to.eql(testRides[0].description);
            expect(res.body[0].capacity).to.eql(testRides[0].capacity);          
          });
      });

      it('should return the rides based on search params with just starting', () => {
        const testSearch = {
          starting: testRides[3].starting,
        };

        return supertest(app)
          .post('/api/rides')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(testSearch)
          .expect(201)
          .expect(res => {
            expect(res.body[0]).to.have.property('id');
            expect(res.body[0]).to.have.property('driver_id');
            expect(res.body[0]).to.have.property('driver_name');
            expect(res.body[0].starting).to.eql(testRides[3].starting);
            expect(res.body[0].destination).to.eql(testRides[3].destination);
            expect(res.body[0].description).to.eql(testRides[3].description);
            expect(res.body[0].capacity).to.eql(testRides[3].capacity);          
          });
      });

      it('should return the rides based on search params with just destination', () => {
        const testSearch = {
          destination: testRides[2].destination,
        };

        return supertest(app)
          .post('/api/rides')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(testSearch)
          .expect(201)
          .expect(res => {
            expect(res.body[0]).to.have.property('id');
            expect(res.body[0]).to.have.property('driver_id');
            expect(res.body[0]).to.have.property('driver_name');
            expect(res.body[0].starting).to.eql(testRides[2].starting);
            expect(res.body[0].destination).to.eql(testRides[2].destination);
            expect(res.body[0].description).to.eql(testRides[2].description);
            expect(res.body[0].capacity).to.eql(testRides[2].capacity);          
          });
      });

      it('should return 404 not found if no results found with starting and destination', () => {
        const failSearch = {
          starting: 'Fail',
          destination: 'Fail',
        };

        return supertest(app)
          .post('/api/rides')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(failSearch)
          .expect(404, {
            error: 'No Rides Available From This Starting Location To This Destination'
          });
      });

      it('should return 404 not found if no results found with only starting', () => {
        const failSearch = {
          starting: 'Fail',
        };

        return supertest(app)
          .post('/api/rides')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(failSearch)
          .expect(404, {
            error: 'No Rides Available From This Starting Location'
          });
      });

      it('should return 404 not found if no results found with only destination', () => {
        const failSearch = {
          destination: 'Fail',
        };

        return supertest(app)
          .post('/api/rides')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(failSearch)
          .expect(404, {
            error: 'No Rides Available to this Destination'
          });
      });

    });
 

    // describe('/api/rides/driver routes', () => {

    describe('GET /driver', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });
      it('should return the rides that a driver is driving', () => {

        return supertest(app)
          .get('/api/rides/driver')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(200);
      });
    });

    describe('POST /driver', () => {

      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });

      it('should add a new ride that a driver is driving', () => {

        newRide = {
          starting: 'Blacksburg',
          destination: 'Virginia Beach',
          date: '2019-12-01',
          time: '08:00:00',
          description: '$10 for gas',
          capacity: 4,
        };

        return supertest(app)
          .post('/api/rides/driver')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(newRide)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('driver_id');
            expect(res.body.starting).to.eql(newRide.starting);
            expect(res.body.destination).to.eql(newRide.destination);
            expect(res.body.description).to.eql(newRide.description);
            expect(res.body.capacity).to.eql(newRide.capacity);
          })
          .expect(res => {
            db
              .from('rides')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.id).to.eql(res.body.id);
              });
          });
      });

    });

    describe('DEL /driver', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });
      it('should delete the ride by id', () => {

        const idToDelete = {
          ride_id: '8c792a91-d346-4f93-bd77-1c04ddc7ccac'
        };

        return supertest(app)
          .delete('/api/rides/driver')
          .send(idToDelete)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(204);
      });

      it('should get 400 if user id !== driver id', () => {

        const idToDelete = {
          ride_id: '64ea927f-441d-40d4-974b-9c79c8c22d1d'
        };

        return supertest(app)
          .delete('/api/rides/driver')
          .send(idToDelete)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(400, {
            error: 'You Cannot Delete A Ride That You Are Not Driving'
          });
      });
      
    });

    // });

    // describe('/api/rides/:ride_id routes', () => {
    describe('GET /:ride_id', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });
      it('should get ride by id', () => {

        let ride_id = '8c792a91-d346-4f93-bd77-1c04ddc7ccac';

        return supertest(app)
          .get(`/api/rides/${ride_id}`)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(200);
      });

      it('should throw 400 if ride_id is not uuid', () => {

        let ride_id = 'fail';

        return supertest(app)
          .get(`/api/rides/${ride_id}`)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(400, {
            error: 'Invalid ride_id'
          });
      });

      it('should throw 404 if ride_id does not exist and is uuid', () => {

        let ride_id = 'd72628e3-1ef8-4cd4-b1d0-0db190c6e3c2';

        return supertest(app)
          .get(`/api/rides/${ride_id}`)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(404, {
            error: 'Ride Does Not Exist'
          });
      });
    });

    describe('PATCH /:ride_id', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });
      it('should reqest and edit db', () => {

        let ride_id = '8c792a91-d346-4f93-bd77-1c04ddc7ccac';

        let editRide = {
          starting: 'Alabama',
          destination: 'Virginia Beach',
          date: '2019-09-16',
          time: '08:00:00',
          description: 'test test test'
        };

        return supertest(app)
          .patch(`/api/rides/${ride_id}`)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(editRide)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('driver_id');
            expect(res.body.starting).to.eql(editRide.starting);
            expect(res.body.destination).to.eql(res.body.destination);
            expect(res.body.description).to.eql(editRide.description);
            expect(res.body.capacity).to.eql(res.body.capacity);
          });
      });

      it('should throw 400 if invalid date', () => {

        let ride_id = '8c792a91-d346-4f93-bd77-1c04ddc7ccac';

        let editRide = {
          starting: 'Alabama',
          destination: 'Virginia Beach',
          date: '2019-0912-16',
          time: '08:00:00',
          description: 'test test test'
        };

        return supertest(app)
          .patch(`/api/rides/${ride_id}`)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(editRide)
          .expect(400, {
            error: 'Enter a valid date'
          });
      });

      it('should throw 400 if invalid time', () => {

        let ride_id = '8c792a91-d346-4f93-bd77-1c04ddc7ccac';

        let editRide = {
          starting: 'Alabama',
          destination: 'Virginia Beach',
          date: '2019-09-16',
          time: '08:asdf:00',
          description: 'test test test'
        };

        return supertest(app)
          .patch(`/api/rides/${ride_id}`)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(editRide)
          .expect(400, {
            error: 'Enter a valid time'
          });
      });
    });
    // });

    // describe.only('/api/rides/passenger routes', () => {


    describe('GET /api/rides/passenger', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });

      it('should get rides by passenger id', () => {

        return supertest(app)
          .get('/api/rides/passenger')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(200);
      });
    });

    describe('POST /api/rides/passenger', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });
      it('should add a passenger to a ride', () => {

        let rideId = {
          ride_id: '87e2b4dd-ca1a-4df7-9c93-842eb9a9bf3b'
        };

        return supertest(app)
          .post('/api/rides/passenger')
          .send(rideId)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(201);
      });

      it('should get 400 if driver is trying to add themselves to their ride', () => {

        let rideId = {
          ride_id: '57bd37c7-7d87-40bc-a691-00f25988f298'
        };

        return supertest(app)
          .post('/api/rides/passenger')
          .send(rideId)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(400, {
            error: 'Driver Cannot Add Themselves As A Passenger'
          });
      });

      it('should get 400 if max capacity is reached', () => {

        let rideId = {
          ride_id: 'd72628e3-1ef8-4cd4-b1d0-0db190c6e3c7'
        };

        return supertest(app)
          .post('/api/rides/passenger')
          .send(rideId)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(400, {
            error: 'Max Capacity Reached'
          });
      });

      it('should get 400 if user is already a part of the ride', () => {

        let rideId = {
          ride_id: '64ea927f-441d-40d4-974b-9c79c8c22d1d'
        };

        return supertest(app)
          .post('/api/rides/passenger')
          .send(rideId)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(400, {
            error: 'You Have Already Reserved A Spot In This Ride'
          });
      });
    });

    describe('PATCH /api/rides/passenger', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });
      it('should remove passenger from ride if they are a part of it', () => {

        const rideId = {
          ride_id: '64ea927f-441d-40d4-974b-9c79c8c22d1d'
        };

        return supertest(app)
          .patch('/api/rides/passenger')
          .send(rideId)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(200);
      });

      it('should throw 400 if user is not a part of the ride', () => {

        const rideId = {
          ride_id: 'd72628e3-1ef8-4cd4-b1d0-0db190c6e3c7'
        };

        return supertest(app)
          .patch('/api/rides/passenger')
          .send(rideId)
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .expect(400, {
            error: 'You Must Be A Part Of This Ride To Remove Yourself'
          });
      });
    });
    // });

  });
});