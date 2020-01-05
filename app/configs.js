/**
 * Created by Rajesh on 7/4/19.
 */

require("dotenv").config();

module.exports = {
  mongoHost: process.env.PIPILIKA_MONGO_HOST
    ? process.env.PIPILIKA_MONGO_HOST
    : "localhost",
  mongoPort: process.env.PIPILIKA_MONGO_PORT
    ? process.env.PIPILIKA_MONGO_PORT
    : "27017",
  database: process.env.PIPILIKA_DATABASE_NAME
    ? process.env.PIPILIKA_DATABASE_NAME
    : "eFileDashboard",

  systemAdmin: process.env.SYSTEM_ADMIN
    ? process.env.SYSTEM_ADMIN
    : "admin@pipilika.com",
  systemAdminPassword: process.env.SYSTEM_ADMIN_PASSWORD
    ? process.env.SYSTEM_ADMIN_PASSWORD
    : "123456",

  solrStatsApi: process.env.SOLR_STATS_API
    ? process.env.SOLR_STATS_API
    : "https://efile-api.pipilika.com/efile-api/"
};
