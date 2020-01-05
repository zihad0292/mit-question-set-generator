/**
 * Created by Rajesh on 6/16/19.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var url = require('url');
var IndexRelation = require('../models/indexRelation');


module.exports = {
    createIndex: function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var indexRequest = {
            dbConfigId  : ObjectId(query.db),
            name        : query.n,
            enable      : query.e,
            query       : query.q,
            indexTables : JSON.parse(query.idx)
        };

        // console.log(indexRequest);
        // console.log(indexRequest.indexTables[0].columns);

        var response = {
            success : true,
            status  : 200
        };

        IndexRelation.create(indexRequest, function (err, result) {
            if(err){
                //next(err);
                //console.log(err);
                response.success = false;
                response.status = 401;
                response.error = err;
            }else {
                response.message = "New Index Successfully added";
            }

            res.json(response);
        });
    },

    indexRelationList: function (req, res) {

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var isValidId = ObjectId.isValid(query.db);

        if(isValidId) {
            IndexRelation.getByDbConfig(ObjectId(query.db), function (err, result) {
                if (err) {
                    response.success = false;
                    response.status = 401;
                    response.error = err;
                } else {
                    response.results = result;
                }

                res.json(response);
            });
        }else{
            response.success = false;
            response.status = 401;
            response.error = "Please Enter a valid Database ID";

            res.json(response);
        }
    },

    findIndex: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        IndexRelation.model.findById(query.id, function (err, result) {
            if(err){
                return next(err);
            }else{
                response.results = result;
                res.json(response);
            }
        })

    },

    updateIndex: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var id = query.id;
        delete query.id;

        var response = {
            success : true,
            status  : 200
        };


        var indexRequest = {
            dbConfigId  : ObjectId(query.db),
            name        : query.n,
            enable      : query.e,
            query       : query.q,
            indexTables : JSON.parse(query.idx)
        };

        IndexRelation.update(id, indexRequest, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "Index Relation Successfully Updated";
                res.json(response);
            }
        })
    },

    deleteIndex: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        IndexRelation.delete(query.id, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "Index Relation Successfully deleted";
                res.json(response);
            }
        })
    },

    countIndex: function (req, res, next){
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var dbList = query.dblist.split(',');

        IndexRelation.model.count({dbConfigId: {$in: dbList}}, function (err, resp) {
            if(err){
                return next(err);
            }else{
                response.total_index = resp;
                res.json(response);
            }
        });
    }
};
