/**
 * Created by Rajesh on 5/27/19.
 */

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var configs = require('./configs');

module.exports = function (app) {
    //DB setup
    var mongoHost = configs.mongoHost;
    var mongoPort = configs.mongoPort;
    var database = configs.database;

    var store = new MongoDBStore({
        uri: 'mongodb://' + mongoHost +  ':'+ mongoPort + '/' + database,
        collection: 'eFileSessions'
    });

// Catch errors
    store.on('error', function(error) {
        console.log(error);
    });

    app.use(session({
        secret: 'E File Admin Dashboard',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
            secure: false,
            httpOnly: false,
        },
        store: store,
        resave: false,
        saveUninitialized: true
    }));
};


