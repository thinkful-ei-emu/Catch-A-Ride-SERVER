const knex = require('knex');
const config = require('../src/config');

const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', () => {
  let db;


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


  describe('POST /api/auth/glogin', () => {
    beforeEach('insert users', () => {
      return helpers.seedUsers(db);
    });

    it('should do something', async () => {
      return supertest(app)
        .get('/api/auth')
        .set('Authorization', 'bearer valid_test_token')
        .expect(200, 'Authenticated!');
    });

  });
});