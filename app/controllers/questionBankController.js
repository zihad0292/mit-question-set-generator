var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var url = require("url");
var QuestionBank = require("../models/questionBank");

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
    console.log("counting");
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

    QuestionBank.count({ subject: "english" }, cb);
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
