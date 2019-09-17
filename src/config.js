module.exports = {
  PORT: process.env.PORT || '8080',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ID: process.env.CLIENT_ID || 'Google API Client ID here',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'Google API Client Secret here',
  DB_URL: process.env.DB_URL
};