const express = require('express');

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter
  .post('/', jsonBodyParser, async (req, res, next) => {
    try {

    }
    catch (e) {
      next();
    }
  });

userRouter
  .post('/register', jsonBodyParser, async (req, res, next) => {

  });

export default userRouter;