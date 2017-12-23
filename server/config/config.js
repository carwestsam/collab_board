module.exports = {
  "development": {
    "url": process.env.DB_URL,
    "dialect": "postgres"
  },
  "production": {
    "url": process.env.DB_URL,
    "dialect": "postgres"
  }
}
