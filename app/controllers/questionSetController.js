var url = require("url");
var DataType = require("../models/dataType");

module.exports = {
  getAllTypes: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    DataType.getAll(query.showAll, function(err, result) {
      if (err) {
        return next(err);
      } else {
        response.results = result;
      }

      res.json(response);
    });
  },

  createDataType: function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var DataTypeRequest = {
      dataType: decodeURIComponent(query.d),
      enabled: decodeURIComponent(query.e),
      hasCredentials: decodeURIComponent(query.h)
    };

    var response = {
      success: true,
      status: 200
    };

    DataType.create(DataTypeRequest, function(err, result) {
      if (err) {
        //next(err);
        response.success = false;
        response.status = 401;
        response.error = err;
      } else {
        response.message = "New Data Type Successfully added";
      }

      res.json(response);
    });
  },

  updateDataType: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    var dbRequest = {
      dataType: decodeURIComponent(query.d),
      enabled: decodeURIComponent(query.e),
      hasCredentials: decodeURIComponent(query.h)
    };

    DataType.update(query.id, dbRequest, function(err, success) {
      if (err) {
        return next(err);
      } else {
        response.message = "Data Type Successfully updated";
        res.json(response);
      }
    });
  },

  deleteDataType: function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
      success: true,
      status: 200
    };

    DataType.delete(query.id, function(err, success) {
      if (err) {
        return next(err);
      } else {
        response.message = "Data Type Successfully deleted";
        res.json(response);
      }
    });
  }
};
