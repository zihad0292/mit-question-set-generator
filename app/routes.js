require("dotenv").config();
var express = require("express");

var routes = express.Router();

var questionBankController = require("./controllers/questionBankController");
// var questionSetController = require("./controllers/questionSetController");

// Question Bank CRUD
routes.get("/question-bank/list", questionBankController.getAllQuestions);
routes.post("/question-bank/create", questionBankController.createQuestion);
routes.post("/question-bank/edit", questionBankController.updateQuestion);
routes.delete("/question-bank/delete", questionBankController.deleteQuestion);

// Question Set CRUD
// routes.get("/question-set/list", questionSetController.questionSets);
// routes.post("/question-set/new", questionSetController.createQuestionSet);
// routes.delete("/question-set/delete", questionSetController.deleteQuestionSet);

// Stat
// routes.get("/stats", console.log("Retrieving stat from backend"));

module.exports = routes;
