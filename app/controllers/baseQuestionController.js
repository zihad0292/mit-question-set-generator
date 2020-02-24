var url = require("url");
var BaseQuestion = require("../models/baseQuestion");
var QuestionBank = require("../models/questionBank");

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

    var questionIDs = JSON.parse(query.allQuestions);
    var cb = function(err, result) {
      if (err) {
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        var finalResult = [];
        for (var i = 0; i < questionIDs.length; i++) {
          let questionTopush = result.filter(question => {
            return questionIDs[i] == question._id;
          });
          finalResult.push(questionTopush[0]);
        }
        response.results = finalResult;
      }
      res.json(response);
    };
    QuestionBank.find({ _id: { $in: JSON.parse(query.allQuestions) } }, cb);
  },
  //   deleteOffice: function (req, res, next) {
  //     var url_parts = url.parse(req.url, true);
  //     var query = url_parts.query;

  //     var response = {
  //         success : true,
  //         status  : 200
  //     };

  //     Office.findOne({ _id: query.id }, function (err, office) {
  //         User.deleteMany(office._id);
  //         DBConfig.findOnlyId({ token: office.primary_key },function (err, dbconfig) {
  //             dbconfig.forEach(function (item) {
  //                 IndexRelation.deleteMany(item._id);
  //             });
  //         });
  //         DBConfig.deleteMany(office.primary_key);
  //     });

  //     Office.delete(query.id, function (err, success) {
  //         if(err){
  //             return next(err);
  //         }else{
  //             response.message = "Office Successfully deleted";
  //             res.json(response);
  //         }
  //     })
  // },

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
