var url = require("url");
var QuestionSet = require("../models/questionSet");
var QuestionBank = require("../models/questionBank");

module.exports = {
  getAllQuestionSets: function(req, res, next) {
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

    var response = {
      success: true,
      status: 200
    };

    var QuestionSetRequest = {
      setName: query.questionSetName,
      questionPaper1: JSON.parse(decodeURI(query.questionPaper1)),
      questionPaper2: JSON.parse(decodeURI(query.questionPaper2)),
      questionPaper3: JSON.parse(decodeURI(query.questionPaper3)),
      questionPaper4: JSON.parse(decodeURI(query.questionPaper4)),
      subjectOrder: JSON.parse(query.subjectOrder),
      optionsReorder: query.optionsReorder
    };

    console.log(
      typeof JSON.parse(decodeURI(QuestionSetRequest.questionPaper1))
    );

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

  countQuestionSet: function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    QuestionSet.count({}, function(err, result) {
      if (err) {
        //next(err);
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.results = result;
      }

      res.json(response);
    });
  },

  findQuestionSet: function(req, res) {
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
    QuestionSet.findOne({ _id: query.id }, cb);
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
