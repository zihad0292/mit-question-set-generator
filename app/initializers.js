var mongoose = require("mongoose");
var User = require("./models/users");
var DataType = require("./models/dataType");
var configs = require("./configs");

var systemInfo = {
  email: configs.systemAdmin,
  pass: configs.systemAdminPassword,
  type: "super-admin",
  office: "pipilika-office"
};

var defaultDataTypes = [
  {
    dataType: "PLAIN",
    enabled: true,
    hasCredentials: false
  },
  {
    dataType: "BASE64",
    enabled: true,
    hasCredentials: false
  },
  {
    dataType: "HTML",
    enabled: true,
    hasCredentials: false
  },
  {
    dataType: "FTP",
    enabled: true,
    hasCredentials: true
  },
  {
    dataType: "SFTP",
    enabled: true,
    hasCredentials: true
  },
  {
    dataType: "ENCRYPTION",
    enabled: true,
    hasCredentials: true
  }
];

module.exports = {
  createSystemUser: function() {
    mongoose.connection.on("connected", function() {
      User.find({ email: systemInfo.email }, function(err, result) {
        if (err) {
          console.log("User could not be fetched at this moment, DB ERROR!!!");
        } else if (result.length > 0) {
          console.log("User Found with the email: " + systemInfo.email);
        } else {
          var userRequest = {
            email: systemInfo.email,
            password: systemInfo.pass,
            type: systemInfo.type,
            secondary_key: "",
            office_name: systemInfo.office,
            office_id: null
          };

          User.create(userRequest, function(err, response) {
            if (err) {
              console.log(
                "System User could not be created, MONGO DB failed!!!"
              );
            } else {
              console.log(
                "System User Created with email: " + systemInfo.email
              );
            }
          });
        }
      });
    });
  },

  createFieldDataType: function() {
    mongoose.connection.on("connected", function() {
      DataType.model.count({}, function(err, count) {
        if (err) {
          return next(err);
        }
        if (count == 0) {
          defaultDataTypes.map(function(dataType) {
            DataType.model.create(dataType, function(err, resp) {
              if (err) {
                console.log(
                  "Default Data Type Could not be created, MONGO DB failed!!!"
                );
              } else {
                console.log(
                  "Data type Created with type: " + dataType.dataType
                );
              }
            });
          });
        } else {
          console.log("%d data types are already created before", count);
        }
      });
    });
  }
};
