var delay = 0;

var superAdminPath = ["office", "users"];

module.exports = {
  requireAuthentication: function(req, res, next) {
    var sess = req.session;

    if (sess.isLoggedIn) {
      next();
    } else {
      res.redirect("/login");
    }
  },

  superAdminAuth: function(req, res, next) {
    var requireAuth = false;

    superAdminPath.forEach(function(path) {
      if (req.path.includes(path)) {
        requireAuth = true;
      }
    });

    if (requireAuth) {
      var sess = req.session;
      if (sess.type == "super-admin") {
        next();
      } else {
        res.redirect("/dashboard");
      }
    } else {
      next();
    }
  },

  fakeDelay: function(req, res, next) {
    setTimeout(next, delay);
  }
};
