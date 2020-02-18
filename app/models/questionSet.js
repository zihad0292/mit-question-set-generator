var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var questionSetSchema = new Schema(
  {
    questionSetName: {
      type: String,
      required: [true, "QuestionSet Name Can't be empty"]
    },
    questionSet: [
      {
        subject: String,
        questions: [
          {
            question: String,
            options: [{ option: String, is_correct: Boolean }]
          }
        ]
      }
    ]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

var QuestionSet = mongoose.model("questionSets", questionSetSchema);

module.exports = {
  model: QuestionSet,

  create: function(params, result) {
    var questionSetInfo = new QuestionSet(params);

    var error = questionSetInfo.validateSync();

    if (error) {
      result(error, null);
    } else {
      questionSetInfo.save(function(err) {
        if (err) {
          result(err, null);
        } else {
          result(null, true);
        }
      });
    }
  },

  getAll: function(result) {
    QuestionSet.find({}).exec(function(err, results) {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
      }
    });
  },

  count: function(params, response) {
    QuestionSet.count(params, function(err, questionSetCount) {
      if (err) {
        response(err, null);
      } else {
        response(null, questionSetCount);
      }
    });
  },

  findOne: function(params, response) {
    QuestionSet.findOne(params, function(err, question) {
      if (err) {
        response(err, null);
      } else {
        response(null, question);
      }
    });
  },

  delete: function(id, result) {
    QuestionSet.deleteOne({ _id: id }, function(err) {
      if (err) {
        result(err, null);
      } else {
        result(null, true);
      }
    });
  }
};
