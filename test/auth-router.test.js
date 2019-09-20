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

    it('should respond with 200 and \'Authenticated\' when it receives a valid token', () => {
      return supertest(app)
        .get('/api/auth')
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .expect(200, 'Authenticated!');
    });

  });
});