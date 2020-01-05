/**
 * Created by Rajesh on 6/23/19.
 */

var mysql = require('mysql');

// create
var poolCluster = mysql.createPoolCluster();

module.exports = {
    addDatabase: function (clusterID, host, port, user, pass, dbname) {
        var config = {
            host: host,
            port: port,
            user: user,
            password: pass,
            database: dbname,
        };

        poolCluster.add(clusterID, config);
    },

    pool: poolCluster
};


