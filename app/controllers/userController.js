/**
 * Created by Rajesh on 6/18/19. Modified by Zihad Ul Islam Mahdi on 9/2/19.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var url = require('url');
var User = require('../models/users');

module.exports = {
    usersList: function (req, res, next) {

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
            User.find({"office_id": office_id}, cb);
        }else{
            User.getAll(cb)
        }
    },

    createUser: function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var userRequest = {
            email: decodeURIComponent(query.m),
            password: decodeURIComponent(query.p),
            type: decodeURIComponent(query.t),
            secondary_key: '',
            office_name: decodeURIComponent(query.oname),
            office_id:ObjectId(decodeURIComponent(query.oid))
        };

        var response = {
            success : true,
            status  : 200
        };

        User.find({email: userRequest.email}, function (error, userList) {
            if(!error) {
                if(userList.length > 0){
                    response.success = false;
                    response.status = 401;
                    response.error = "Email already Exists";
                    res.json(response);
                }else{
                    User.create(userRequest, function (err, result) {
                        if (err) {
                            //next(err);
                            response.success = false;
                            response.status = 401;
                            response.error = err.message ? err.message : err;
                        } else {
                            response.message = "New User Successfully added";
                        }

                        res.json(response);
                    });
                }
            }else{
                response.success = false;
                response.status = 401;
                response.error = error.message ? error.message : error;

                res.json(response);
            }
        });
    },

    updateUser: function (req, res, next) {

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var dbRequest = {
            email: decodeURIComponent(query.m),
            password: decodeURIComponent(query.p)
        };

        User.update(query.id, dbRequest, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "User Successfully updated";
                res.json(response);
            }
        })
    },


    deleteUser: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        User.delete(query.id, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "User Successfully deleted";
                res.json(response);
            }
        })
    }
};


