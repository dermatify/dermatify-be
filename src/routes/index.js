var root = require("./rootRoutes");
var auth = require("./authRoutes");

module.exports = [].concat(root, auth);
