var root = require("./rootRoutes");
var auth = require("./authRoutes");
var user = require("./userRoutes");

module.exports = [].concat(root, auth, user);
