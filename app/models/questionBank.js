var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var questionBankSchema = new Schema(
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
        is_correct: String
      }
    ]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// officeSchema.pre('save', function (next) {
//     var office = this;
//     // only hash the password if it has been modified (or is new)
//     if (!office.isModified('name')) return next();

//     var secondary = office.name;
//     office.primary_key = md5(secondary);
//     next();
// });

// we need to create a model using it
var QuestionBank = mongoose.model("questionBank", questionBankSchema);

module.exports = {
  model: QuestionBank,

  create: function(params, result) {
    console.log(params);
    var questionDetails = new QuestionBank(params);

    var error = questionDetails.validateSync();

    if (error) {
      result(error, null);
    } else {
      questionDetails.save(function(err) {
        if (err) {
          result(err, null);
        } else {
          result(null, true);
        }
      });
    }
  },

  find: function(params, response) {
    QuestionBank.find(params, function(err, question) {
      if (err) {
        response(err, null);
      } else {
        response(null, question);
      }
    });
  },

  findOne: function(params, response) {
    QuestionBank.findOne(params, function(err, question) {
      if (err) {
        response(err, null);
      } else {
        response(null, question);
      }
    });
  },

  getAll: function(result) {
    QuestionBank.find({})
      .limit(10)
      .sort({ created_at: -1 })
      .exec(function(err, questions) {
        if (err) {
          result(err, null);
        } else {
          result(null, questions);
        }
      });
  },

  update: function(id, params, result) {
    Office.findOneAndUpdate(
      { _id: id },
      params,
      { runValidators: false },
      function(err) {
        if (err) {
          result(err, null);
        } else {
          result(null, true);
        }
      }
    );
  },

  delete: function(id, result) {
    Office.deleteOne({ _id: id }, function(err) {
      if (err) {
        result(err, null);
      } else {
        result(null, true);
      }
    });
  }
};
