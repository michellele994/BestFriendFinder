var express = require("express");
var parser = require("body-parser");
var path = require("path");

var app = express();
var PORT = 3000;

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

require("./routing/apiRoutes")(app);
require("./routing/htmlRoutes")(app);


app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
