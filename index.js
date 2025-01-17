require("dotenv").config();

var app = require("./app/app");

var PORT = process.env.APP_PORT ? process.env.APP_PORT : "3000";

app.listen(PORT, "0.0.0.0", function(error) {
  if (error) {
    console.log(error);
  } else {
    console.log("App Started at: http://0.0.0.0:" + PORT);
  }
});
