const { OAuth2Client } = require('google-auth-library');

const config = require('../config');
const client = new OAuth2Client(config.CLIENT_ID);

const AuthService = {
  tableName: 'users',

  /**
   * use google auth library to verify validity of 
   * id_token
   */
  async verifyGoogleToken(idToken) {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: config.CLIENT_ID
      });

      const payload = ticket.getPayload();
      const userid = payload['sub'];

      return userid;
    }
    catch (e) {
      console.error(e.message);
    }
  },

  /**
   * queries database for any user with the matching
   * username
   * 
   * @param {knex instance} db 
   * @param {string} username 
   */
  hasUserWithUserName(db, username) {
    return db(this.tableName)
      .where({
        username
      })
      .first();
  },

  /**
   * inserts a new user object into database
   * 
   * @param {knex instance} db 
   * @param {object} newUser 
   */
  insertUser(db, newUser) {
    return db(this.tableName)
      .insert({
        ...newUser
      })
      .returning('*');
  },

  /**
   * enforces password complexity
   * probably obsoleted in place of Google OAuth
   * 
   * @param {string} password 
   */
  validatePassword(password) { }


};

module.exports = AuthService;