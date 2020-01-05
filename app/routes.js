require("dotenv").config();
var express = require("express");
var middleware = require("./middlewares");

var routes = express.Router();

var questionBankController = require("./controllers/questionBankController");
var questionSetController = require("./controllers/questionSetController");

routes.use(middleware.fakeDelay);

// Question Bank CRUD
routes.get("/question-bank/list", questionBankController.getAllQuestions);
routes.post("/question-bank/new", questionBankController.createQuestion);
routes.post("/question-bank/update", questionBankController.updateQuestion);
routes.delete("/question-bank/delete", questionBankController.deleteQuestion);

// Question Set CRUD
routes.get("/question-set/list", questionSetController.questionSets);
routes.post("/question-set/new", questionSetController.createQuestionSet);
routes.post("/question-set/update", questionSetController.updateQuestionSet);
routes.delete("/question-set/delete", questionSetController.deleteQuestionSet);

module.exports = routes;
