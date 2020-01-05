/**
 * Created by Rajesh on 6/12/19. Modified by Zihad Ul Islam Mahdi on 9/19/19.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var url = require('url');
var Office = require('../models/office');
var User = require('../models/users');
var DBConfig = require('../models/dbConfig');
var IndexRelation = require('../models/indexRelation');

module.exports = {
    officeList: function (req, res) {

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var cb = function (err, result) {
            if (err) {
                response.success = false;
                response.status = 401;
                response.error = err;
            } else {
                if(result && result.length > 0)
                    response.results = result;
                else{
                    response.results = [];
                    if(result) response.results.push(result);
                }
            }
            
            res.json(response);
        };

        if(query.oid){
            var office_id= ObjectId(query.oid);
            Office.model.findById(office_id, cb);
        }else{
            Office.getAll(cb)
        }
    },

    createOffice: function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var officeRequest = {
            name: decodeURIComponent(query.n),
            location: decodeURIComponent(query.l)
        };

        var response = {
            success : true,
            status  : 200
        };

        Office.create(officeRequest, function (err, result) {
            if(err){
                //next(err);
                response.success = false;
                response.status = 401;
                response.error = err;
            }else {
                response.message = "New office Successfully added";
            }

            res.json(response);
        });
    },

    updateOffice: function (req, res, next) {

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var dbRequest = {
            name: decodeURIComponent(query.n),
            location: decodeURIComponent(query.l)
        };

        Office.update(query.id, dbRequest, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "Office Successfully updated";
                res.json(response);
            }
        })
    },


    deleteOffice: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        Office.findOne({ _id: query.id }, function (err, office) {
            User.deleteMany(office._id);
            DBConfig.findOnlyId({ token: office.primary_key },function (err, dbconfig) {
                dbconfig.forEach(function (item) {
                    IndexRelation.deleteMany(item._id);
                });
            });
            DBConfig.deleteMany(office.primary_key);
        }); 

        Office.delete(query.id, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "Office Successfully deleted";
                res.json(response);
            }
        })
    }
};

