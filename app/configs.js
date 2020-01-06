require("dotenv").config();

module.exports = {
  mongoHost: process.env.QBG_MONGO_HOST
    ? process.env.QBG_MONGO_HOST
    : "localhost",
  mongoPort: process.env.QBG_MONGO_PORT ? process.env.QBG_MONGO_PORT : "27017",
  database: process.env.QBG_DATABASE_NAME
    ? process.env.QBG_DATABASE_NAME
    : "mitQBG"
};
