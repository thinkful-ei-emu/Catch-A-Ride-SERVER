const express = require('express');
const authService = require('./auth-service');

const config = require('../config');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
  .post('/glogin', jsonBodyParser, async (req, res, next) => {
    const { id_token } = req.body;

    try {
      /**
       * check validity of id_token here
       */

      const userid = await authService.verifyGoogleToken(id_token);

      return res.json({ userid });
    }
    catch (e) {
      next();
    }
  });

module.exports = authRouter;