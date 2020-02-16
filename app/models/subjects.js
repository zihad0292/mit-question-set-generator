var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var subjectSchema = new Schema(
  {
    subject: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Subject Field must be unique and can not be empty"]
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// we need to create a model using it
var Subjects = mongoose.model("subjects", subjectSchema);

module.exports = {
  model: Subjects,

  create: function(params, result) {
    var subjectDetails = new Subjects(params);

    var error = subjectDetails.validateSync();

    if (error) {
      result(error, null);
    } else {
      subjectDetails.save(function(err) {
        if (err) {
          result(err, null);
        } else {
          result(null, true);
        }
      });
    }
  },

  getAll: function(result) {
    Subjects.find({})
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

  delete: function(id, result) {
    Subjects.deleteOne({ _id: id }, function(err) {
      if (err) {
        result(err, null);
      } else {
        result(null, true);
      }
    });
  }
};
