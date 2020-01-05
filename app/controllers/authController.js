/**
 * Created by Rajesh on 5/28/19.
 */

var url = require('url');
var User = require('../models/users');
var sqlCluster = require('../sqlpool');

module.exports = {
  authenticate: function (req, res, next) {
      var url_parts = url.parse(req.url, true);
      var params = url_parts.query;

      var response = {
          success : true,
          status  : 200
      };

      User.model.findOne({email: params.u}, function (error, user) {
          if(!error) {
              if(user) {
                  user.comparePassword(params.p, function (err, isMatch) {
                      if (err) throw err;
                      if (isMatch) {
                          response.message = "User Successfully Authenticated";

                          req.session.user = params.u;
                          req.session.type = user.type;
                          req.session.isLoggedIn = true;
                          req.session.key = user.secondary_key;
                          req.session.office = user.office_name;
                          req.session.office_id = user.office_id;

                          var sessionObj = JSON.parse(JSON.stringify(req.session));
                          delete sessionObj["cookie"];
                          response.data = sessionObj;

                      } else {
                          response.success = false;
                          response.status = 427;
                          response.message = "User & Password Mismatch";
                      }
                      res.json(response);
                  });
              }else{
                  response.success = false;
                  response.status = 427;
                  response.message = "No User Found With that email";

                  res.json(response);
              }
          }else{
              return next();
          }
      });

  },

  getSessionInfo: function (req, res, next) {
      var response = {
          success : true,
          status  : 200
      };

      if(req.session.user) {
          var sessionObj = JSON.parse(JSON.stringify(req.session));
          delete sessionObj["cookie"];
          response.data = sessionObj;
      }else{
          response.success = false;
          response.status = 427;
          response.message = "No User Logged In";
      }

      res.json(response);
  },

  destroySession: function (req, res, next) {
      var response = {
          success : true,
          status  : 200
      };

      if(req.session.clusterID)
        sqlCluster.pool.remove(req.session.clusterID);

      req.session.destroy(function(err) {
          if(err){
              response.status = 427;
              response.success = false;
              response.message = "Session Can't be destroyed, Please Try again.";
          }else{
              response.message = "User has been logged out."
          }

          res.json(response);
      });
  }
};
