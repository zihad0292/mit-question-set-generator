/**
 * Created by Rajesh on 7/2/19.
 */
var async = require('async');
var url = require('url');
var DBFetchStat = require('../models/dataFetchStats');


module.exports = {
    statsList: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var offset = query.offset ? parseInt(query.offset) : 0;

        var countTotal = function (callback) {
            DBFetchStat.model.count({dbConfigId: query.db}, function (err, count) {
                if(err){ callback(err, null) }
                else{
                    callback(null, count);
                }
            })
        };

        var getConfigList = function (callback) {
            DBFetchStat.findByDbConfig(query.db, offset, function (err, result) {
                if(err){
                    callback(err, null);
                }else {
                    callback(null, result);
                }
            })
        };

        async.parallel([countTotal, getConfigList], function (err, results) {

            if(err){
                return next(err);
            }else {
                response.total = results[0];
                response.results = results[1];
            }

            res.json(response);
        });

    }
};
