var Author, crypto;
crypto = require('crypto');
Author = function(options) {
  this.fill(options);
  this.db = options.db || Author.db;
  return this;
};
Author.prototype.fill = function(options) {
  this.name = options.name;
  this.email = options.email;
  this.salt = options.salt || Author.generate_salt();
  return (this.pw = options.pw);
};
Author.prototype.set_password = function(pass) {
  return (this.pw = Author.hash_password(this.salt, pass));
};
Author.prototype.authenticates = function(pass) {
  return Author.hash_password(this.salt, pass) === this.pw;
};
Author.generate_salt = function() {
  var hash;
  hash = crypto.createHash('md5');
  hash.update(this.name);
  hash.update(this.email);
  hash.update(Math.random().toString());
  return hash.digest('hex');
};
Author.hash_password = function(salt, pass) {
  var hash;
  hash = crypto.createHash('md5');
  hash.update(salt);
  hash.update(pass);
  return hash.digest('hex');
};
exports.Author = Author;