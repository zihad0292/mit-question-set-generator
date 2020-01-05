/**
 * Created by Rajesh on 6/13/19.
 */

var url = require('url');
var DBConfig = require('../models/dbConfig');

module.exports = {
    createDb: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var dbRequest = {
            name          : query.n,
            host          : query.h,
            port          : query.p,
            dbName        : query.db,
            enable        : query.e,
            frequency     : query.f,
            crawling      : query.c ? query.c : false,
            status        : query.s ? query.s : "START",
            user          : query.user,
            password      : query.pass,
            token         : query.tkn,
        };

        var response = {
            success : true,
            status  : 200
        };

        DBConfig.create(dbRequest, function (err, result) {
            if(err){
                //next(err);
                response.success = false;
                response.status = 401;
                response.error = err;
            }else {
                response.message = "New Database Successfully added";
            }

            res.json(response);
        });
    },

    dbConfigList: function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        DBConfig.getAll(query.token, function (err, result) {
            if(err){
                response.success = false;
                response.status = 401;
                response.error = err.message;
            }else {
                response.results = result;
            }

            res.json(response);
        })
    },

    updateDbConfig: function (req, res, next) {

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var dbRequest = {
            name          : query.n,
            host          : query.h,
            port          : query.p,
            dbName        : query.db,
            enable        : query.e,
            frequency     : query.f,
            user          : query.user,
            password      : query.pass,
            token         : query.tkn,
        };

        DBConfig.update(query.id, dbRequest, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "Database Config Successfully updated";
                res.json(response);
            }
        })
    },

    deleteDBConfig: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        DBConfig.delete(query.id, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "Database Config Successfully deleted";
                res.json(response);
            }
        })
    }
};
