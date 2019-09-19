const express = require('express');
const AuthService = require('./auth-service');
const { requireAuth } = require('./g-auth');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    return res.send('Authenticated!');
  });

authRouter
  .route('/glogin')
  .post(jsonBodyParser, async (req, res, next) => {
    const db = req.app.get('db');
    const { id_token } = req.body;

    try {
      /**
       * check validity of id_token here
       */
      const validToken = await AuthService.verifyGoogleToken(id_token);
      if (validToken.error) return res.status(400).json(validToken.error);


      /**
       * add user if not exists in database
       */
      let user = await AuthService.getUserWithUserId(
        db,
        validToken.payload.sub
      );

      if (!user) await AuthService.insertUser(
        db,
        {
          email: validToken.payload.email,
          name: validToken.payload.name,
          user_id: validToken.payload.sub
        });

      return res.json(validToken.payload);
    }
    catch (e) {
      console.error(e.message);
      next();
    }
  });

module.exports = authRouter;