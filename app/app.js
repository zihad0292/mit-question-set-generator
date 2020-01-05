var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var configs = require("./configs");
var initializers = require("./initializers");

var sessionManager = require("./session");

var app = express();
var routes = require("./routes");
var middleware = require("./middlewares");
sessionManager(app);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(methodOverride());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "..", "/resources/views"));

//Serve all the Static Files
app.use(express.static(path.join(__dirname, "..", "/public")));

//DB setup
var mongoHost = configs.mongoHost;
var mongoPort = configs.mongoPort;
var database = configs.database;
mongoose.connect("mongodb://" + mongoHost + ":" + mongoPort + "/" + database, {
  useNewUrlParser: true
});
initializers.createSystemUser();
initializers.createFieldDataType();

app.use("/api/", routes);

app.get(
  "/dashboard*",
  [middleware.requireAuthentication, middleware.superAdminAuth],
  function(req, res) {
    res.render("index");
  }
);

app.get("/login", function(req, res) {
  res.render("index");
});

app.get("/", function(req, res) {
  res.redirect("/dashboard/");
});

app.get("/*", function(req, res) {
  res.render("index");
});

// Error Handler Called on next
app.use(function(err, req, res, next) {
  console.error(err.stack);

  var response = {
    success: false,
    status: 500,
    error: err.message ? err.message : err
  };

  res.status(500).json(response);
});

module.exports = app;
