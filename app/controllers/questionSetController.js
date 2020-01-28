var url = require("url");
var QuestionSet = require("../models/questionSet");

module.exports = {
  getAllQuestionSets: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var response = {
      success: true,
      status: 200
    };

    QuestionSet.getAll(function(err, result) {
      if (err) {
        return next(err);
      } else {
        response.results = result;
      }

      res.json(response);
    });
  },

  createQuestionSet: function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var QuestionSetRequest = {
      questionSetName: query.questionSetName,
      questionSet: JSON.parse(query.questionSet)
    };

    var response = {
      success: true,
      status: 200
    };

    QuestionSet.create(QuestionSetRequest, function(err, result) {
      if (err) {
        //next(err);
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.message = "New Question Set Successfully added";
      }

      res.json(response);
    });
  },

  deleteQuestionSet: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    QuestionSet.delete(query.id, function(err, success) {
      if (err) {
        return next(err);
      } else {
        response.message = "Question Set Successfully deleted";
        res.json(response);
      }
    });
  }
};
