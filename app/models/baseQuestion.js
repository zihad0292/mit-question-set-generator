var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var baseQuestionSchema = new Schema(
  {
    baseQuestionName: {
      type: String,
      required: [true, "BaseQuestion Name Can't be empty"]
    },
    selectedSubjects: [String],
    allQuestions: [
      {
        question: {
          type: String,
          required: [true, "Question Field can not be empty"]
        },
        subject: {
          type: String,
          required: [true, "You must select a subject"]
        },
        options: [
          {
            option: String,
            is_correct: Boolean
          }
        ],
        optionsReorder: {
          type: Boolean
        }
      }
    ]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

var BaseQuestion = mongoose.model("baseQuestions", baseQuestionSchema);

module.exports = {
  model: BaseQuestion,

  create: function(params, result) {
    var baseQuestionInfo = new BaseQuestion(params);

    var error = baseQuestionInfo.validateSync();

    if (error) {
      result(error, null);
    } else {
      baseQuestionInfo.save(function(err) {
        if (err) {
          result(err, null);
        } else {
          result(null, true);
        }
      });
    }
  },

  getAll: function(result) {
    BaseQuestion.find({}).exec(function(err, results) {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
      }
    });
  },

  // count: function(params, response) {
  //   baseQuestionInfo.count(params, function(err, questionSetCount) {
  //     if (err) {
  //       response(err, null);
  //     } else {
  //       response(null, questionSetCount);
  //     }
  //   });
  // },

  findOne: function(params, response) {
    BaseQuestion.findOne(params, function(err, question) {
      if (err) {
        response(err, null);
      } else {
        response(null, question);
      }
    });
  },

  delete: function(id, result) {
    BaseQuestion.deleteOne({ _id: id }, function(err) {
      if (err) {
        result(err, null);
      } else {
        result(null, true);
      }
    });
  }
};
