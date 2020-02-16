var mongoose = require("mongoose");

var url = require("url");
var Subjects = require("../models/subjects");

module.exports = {
  getAllSubjects: function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    var cb = function(err, result) {
      if (err) {
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.results = result;
      }

      res.json(response);
    };

    Subjects.getAll(cb);
  },

  createSubject: function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var params = {
      subject: query.subject
    };

    var response = {
      success: true,
      status: 200
    };

    Subjects.create(params, function(err, result) {
      if (err) {
        //next(err);
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.message = "New Subject Successfully added";
      }

      res.json(response);
    });
  },

  deleteSubject: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    Subjects.delete(query.id, function(err, success) {
      if (err) {
        return next(err);
      } else {
        response.message = "Subject Successfully deleted";
        res.json(response);
      }
    });
  }
};
