var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// var optionsSchema = new Schema({
//   option: { type: String },
//   is_correct: { type: Boolean, default: false }
// });

// var questionsSchema = new Schema({
//   question: {
//     type: String,
//     required: [true, "Question Field can not be empty"]
//   },
//   subject: {
//     type: String,
//     required: [true, "You must select a subject"]
//   },
//   options: [optionsSchema],
//   optionsReorder: { type: Boolean, default: true }
// });

var baseQuestionSchema = new Schema(
  {
    baseQuestionName: {
      type: String,
      required: [true, "BaseQuestion Name Can't be empty"]
    },
    selectedSubjects: [
      {
        subject: { type: String },
        count: { type: Number }
      }
    ],
    allQuestions: [String]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// baseQuestionSchema.pre("save", function(next) {
//   var baseQuestion = this;

//   var optionsInfo = [];

//   baseQuestions.allQuestions.forEach(function(question) {
//     question.options.forEach(function(option) {
//       var field = {
//         option: option.option,
//         is_correct: option.is_correct
//       };
//       optionsInfo.push(field);
//     });
//   });

//   baseQuestion.fieldInformations = fieldInfo;

//   next();
// });

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
