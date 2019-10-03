module.exports = {
  PORT: process.env.PORT || '8080',
  TEST_PORT: process.env.TEST_PORT || '8181',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ID: process.env.CLIENT_ID || 'Google API Client ID here',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'Google API Client Secret here',
<<<<<<< HEAD
  DB_URL: process.env.DATABASE_URL || process.env.DB_URL || 'postgresql://scooter@localhost/catch-a-ride',
  TEST_ID_TOKEN: process.env.TEST_ID_TOKEN || 'Google OAuth Test Token Here'
=======
  DB_URL: process.env.DB_URL,
  TEST_ID_TOKEN: process.env.TEST_ID_TOKEN,
  GEO_API_KEY: process.env.GEO_API_KEY
>>>>>>> cedb5e2a56c74f72bfedb7ba1a49bedaf7c790d1
};