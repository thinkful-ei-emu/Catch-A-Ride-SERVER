const AuthService = require('./auth-service');
const config = require('../config');

async function requireAuth(req, res, next) {
  const missingToken = { error: 'missing bearer token' };
  const unauthorizedRequest = { error: 'unauthorized request' };
  const authToken = req.get('Authorization') || '';
  let bearerToken;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json(missingToken);
  }
  else {
    console.log(authToken);
    bearerToken = authToken.split(' ')[1];
  }

  try {
    let payload = await AuthService.verifyGoogleToken(bearerToken);
    payload = payload.payload;
    console.log(payload);

    try {
      const user = await AuthService.getUserWithUserId(
        req.app.get('db'),
        payload.sub
      );

      if (!user) {
        return res.status(401).json(unauthorizedRequest);
      }

      req.user = user;

      next();
    }
    catch (e) {
      next(e);
    }
  }
  catch (e) {
    return res.status(401).json(unauthorizedRequest);
  }
}

module.exports = {
  requireAuth
};