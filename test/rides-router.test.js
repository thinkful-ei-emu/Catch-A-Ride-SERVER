const knex = require('knex');
const config = require('../src/config');

const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Rides Endpoints', () => {
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
  2;
  
  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));


  describe('POST /api/rides', () => {
    beforeEach('insert users', () => {
      helpers.seedUsers(db);
      helpers.seedRides(db);
    });
    it('should return the ride based on search params', async () => {
      const testSearch = {
        starting: testRides[0].starting,
        destination: testRides[0].destination,
      };

      return supertest(app)
        .post('/api/rides')
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .send(testSearch)
        .expect(201, [testRides[0]]);
    });

  });

  describe('')
});