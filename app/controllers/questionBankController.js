var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Async = require("async");

var url = require("url");
var QuestionBank = require("../models/questionBank");
var QuestionSet = require("../models/questionSet");

module.exports = {
  getAllQuestions: function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    var cb = function(err, result) {
      if (err) {
        console.log(err);
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.results = result;
      }

      res.json(response);
    };

    if (query.subject) {
      QuestionBank.find({ subject: query.subject }, cb);
    } else {
      QuestionBank.getAll(cb);
    }
  },
  countQuestions: function(req, res) {
    var response = {
      success: true,
      status: 200
    };

    // QuestionBank.count({ subject: "english" }, cb);
    var countObject = {
      englishCount: function(callback) {
        QuestionBank.count({ subject: "english" }, function(err, data) {
          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err) return callback(err);

          callback(null, data);
        });
      },
      mathCount: function(callback) {
        QuestionBank.count({ subject: "math" }, function(err, data) {
          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err) return callback(err);

          callback(null, data);
        });
      },
      physicsCount: function(callback) {
        QuestionBank.count({ subject: "physics" }, function(err, data) {
          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err) return callback(err);

          callback(null, data);
        });
      },
      chemistryCount: function(callback) {
        QuestionBank.count({ subject: "chemistry" }, function(err, data) {
          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err) return callback(err);

          callback(null, data);
        });
      },
      questionSetCount: function(callback) {
        QuestionSet.count({}, function(err, data) {
          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err) return callback(err);

          callback(null, data);
        });
      }
    };

    Async.parallel(countObject, function(err, results) {
      if (err) {
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.results = results;
      }
      res.json(response);
    });
  },

  createQuestion: function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var params = {
      subject: query.subject,
      question: query.question,
      options: JSON.parse(query.options),
      rearrange_locked: query.rearrange_locked
    };

    var response = {
      success: true,
      status: 200
    };

    QuestionBank.create(params, function(err, result) {
      if (err) {
        //next(err);
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.message = "New Question Successfully added";
      }

      res.json(response);
    });
  },

  updateQuestion: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    var params = {
      question: query.question,
      subject: query.subject,
      options: JSON.parse(query.options),
      rearrange_locked: query.rearrange_locked
    };

    QuestionBank.update(query.id, params, function(err, success) {
      if (err) {
        return next(err);
      } else {
        response.message = "Question Successfully updated";
        res.json(response);
      }
    });
  },

  deleteQuestion: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    QuestionBank.delete(query.id, function(err, success) {
      if (err) {
        return next(err);
      } else {
        response.message = "Question Successfully deleted";
        res.json(response);
      }
    });
  }
};
