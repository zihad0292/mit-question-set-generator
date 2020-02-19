require("dotenv").config();
var express = require("express");

var routes = express.Router();

var questionBankController = require("./controllers/questionBankController");
var questionSetController = require("./controllers/questionSetController");
var baseQuestionController = require("./controllers/baseQuestionController");
var subjectsController = require("./controllers/subjectsController");

// Subjects CRUD
routes.get("/subjects/list", subjectsController.getAllSubjects);
routes.post("/subjects/create", subjectsController.createSubject);
routes.delete("/subjects/delete", subjectsController.deleteSubject);

// Question Bank CRUD
routes.get("/question-bank/list", questionBankController.getAllQuestions);
routes.post("/question-bank/create", questionBankController.createQuestion);
routes.post("/question-bank/edit", questionBankController.updateQuestion);
routes.delete("/question-bank/delete", questionBankController.deleteQuestion);
routes.get("/question-bank/stats/", questionBankController.countQuestions);

// Base Question CRUD
routes.get("/base-question/list", baseQuestionController.getAllBaseQuestions);
routes.get(
  "/base-question/questionBank",
  baseQuestionController.findBaseQuestion
);
routes.post(
  "/base-question/generate",
  baseQuestionController.createBaseQuestion
);
routes.delete(
  "/base-question/delete",
  baseQuestionController.deleteBaseQuestion
);

// Question Set CRUD
routes.get("/question-set/list", questionSetController.getAllQuestionSets);
routes.get("/question-set/questionset", questionSetController.findQuestionSet);
routes.post("/question-set/generate", questionSetController.createQuestionSet);
routes.delete("/question-set/delete", questionSetController.deleteQuestionSet);
routes.get("/question-set/stats/", questionSetController.countQuestionSet);

// Stat
// routes.get("/stats", console.log("Retrieving stat from backend"));

module.exports = routes;
