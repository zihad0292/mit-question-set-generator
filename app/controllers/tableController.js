/**
 * Created by Rajesh on 5/16/19.
 */
var url = require('url');

var sqlModel = require('../models/sqlModel');

var sqlCluster = require('../sqlpool');
var mysql = require('mysql');

function jsonToArray(jsonList, key) {
    var itemList = [];

    jsonList.forEach(function(item){
        itemList.push(item[key]);
    });
    return itemList;
}

module.exports = {

    establishConnection: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var params = url_parts.query;

        sqlCluster.pool.getConnection(params.n, function (error, connection) {

            var response = {
                success : true,
                status  : 200
            };

            if(error){
                sqlCluster.addDatabase(params.n, params.h, params.p, params.user, params.pass, params.db);
                response.message = params.n + " Database Config added";
            }else{
                response.message = params.n + " Database Config was added before"
            }

            req.session.clusterID = params.n;
            req.session.dbName = params.db;

            req.session.save();
            res.json(response);
        });
    },

    checkConnection: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var params = url_parts.query;

        var connection = mysql.createConnection({
            host: params.host,
            port: params.port,
            user: params.user,
            password: params.pass,
            database: params.db,
            connectTimeout : 10000
        });

        var response = {
            success : true,
            status  : 200,
            message: "Valid Database Connection"
        };

        connection.connect(function(err) {
            if (err) {
                return next(err)
            }else{
                connection.end();
                res.json(response);
            }
        });
    },

    getTableList: function (req, res, next) {

        var response = {
            success : true,
            status  : 200
        };

        var clusterID =  req.session.clusterID;
        var dbName = req.session.dbName;

        sqlModel.getTables(clusterID, dbName, function (err, result) {
            if(err){
                return next(err);
            }else {
                response.results = jsonToArray(result, 'table_name');
            }

          res.json(response);
        })
    },

    getColumnList: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var clusterID =  req.session.clusterID;
        var dbName = req.session.dbName;

        sqlModel.getColumns(clusterID, dbName, query.table, function (err, result) {
            if(err){
                return next(err);
            }else {
                response.results = result;
            }

            res.json(response);
        })
    },

    getQueryResponse: function (req, res, next) {

        var url_parts = url.parse(req.url, true);
        var params = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var clusterID =  req.session.clusterID;
        var dbName = req.session.dbName;

        sqlModel.performQuery(clusterID, dbName, params.query, function (err, result) {
            if(err){
                return next(err);
            }else {
                response.results = result;
            }

            res.json(response);
        })
    }

};
