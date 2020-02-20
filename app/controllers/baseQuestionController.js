var url = require("url");
var BaseQuestion = require("../models/baseQuestion");

module.exports = {
  getAllBaseQuestions: function(req, res, next) {
    var response = {
      success: true,
      status: 200
    };

    BaseQuestion.getAll(function(err, result) {
      if (err) {
        return next(err);
      } else {
        response.results = result;
      }

      res.json(response);
    });
  },

  createBaseQuestion: function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var baseQuestionRequest = {
      baseQuestionName: query.baseQuestionName,
      selectedSubjects: JSON.parse(query.selectedSubjects),
      allQuestions: JSON.parse(query.allQuestions)
    };

    console.log(baseQuestionRequest);
    var response = {
      success: true,
      status: 200
    };

    BaseQuestion.create(baseQuestionRequest, function(err, result) {
      if (err) {
        //next(err);
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.message = "New Base Question Successfully added";
      }

      res.json(response);
    });
  },

  // countBaseQuestion: function(req, res) {
  //   var url_parts = url.parse(req.url, true);
  //   var query = url_parts.query;

  //   var response = {
  //     success: true,
  //     status: 200
  //   };

  //   BaseQuestion.count({}, function(err, result) {
  //     if (err) {
  //       //next(err);
  //       response.success = false;
  //       response.status = 401;
  //       response.error = err;
  //     } else {
  //       response.results = result;
  //     }

  //     res.json(response);
  //   });
  // },

  findBaseQuestion: function(req, res) {
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
    BaseQuestion.findOne({ _id: query.id }, cb);
  },

  deleteBaseQuestion: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    BaseQuestion.delete(query.id, function(err, success) {
      if (err) {
        return next(err);
      } else {
        response.message = "Base Question Successfully deleted";
        res.json(response);
      }
    });
  }
};
