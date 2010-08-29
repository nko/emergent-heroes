var couchdb, detail_path, fs, path, stats;
couchdb = require('../vendor/node-couchdb/lib/couchdb');
fs = require('fs');
path = require('path');
detail_path = path.join(__dirname, process.env.SHOWOFF_TIME_DB || "../secret.js");
try {
  stats = fs.statSync(detail_path);
  exports.details = require(detail_path) || {};
  exports.details.port || (exports.details.port = 80);
  exports.details.host || (exports.details.host = 'localhost');
} catch (err) {
  console.log("No details file found at " + (detail_path) + ".");
  console.log("Set one like this:");
  console.log("");
  console.log("  module.exports =");
  console.log("    { port: 80");
  console.log("    , host: 'technoweenie.couchone.com'");
  console.log("    , user: 'ricky'");
  console.log("    , pass: 'bobby'");
  console.log("    }");
}
exports.createClient = function() {
  return couchdb.createClient(exports.details.port, exports.details.host, exports.details.user, exports.details.pass);
};
exports.db = function(name) {
  return exports.createClient().db(name);
};