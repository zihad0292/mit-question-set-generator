/**
 * Created by Rajesh on 5/15/19.
 */

var mysql = require('mysql');

module.exports = function (host, port, user, pass, dbname) {

    var connection = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        password: pass,
        database: dbname,
        connectTimeout : 10000
    });

    connection.connect(function(err) {
        if (err) throw err;
    });

    return connection;
};
