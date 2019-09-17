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
    const { id_token } = req.body;

    try {
      /**
       * check validity of id_token here
       */
      const validToken = await AuthService.verifyGoogleToken(id_token);
      if (validToken.error) return res.status(400).json(validToken.error);
      else return res.json(validToken.userInfo);
    }
    catch (e) {
      next();
    }
  });

module.exports = authRouter;