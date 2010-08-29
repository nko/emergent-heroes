var Author, Model, crypto;
var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
crypto = require('crypto');
Model = require('./model');
Author = function() {
  return Model.apply(this, arguments);
};
__extends(Author, Model);
Author.prototype.fill = function(options) {
  this.db = options.db || Author.db;
  return Author.__super__.fill.call(this, options);
};
Author.prototype.set_password = function(pass) {
  return (this.doc.hash = Author.hash_password(this.doc.salt, pass));
};
Author.prototype.authenticates = function(pass) {
  return Author.hash_password(this.doc.salt, pass) === this.doc.hash;
};
Author.prototype.generate_salt = function() {
  var hash;
  hash = crypto.createHash('md5');
  hash.update(this.doc.name);
  hash.update(this.doc.email);
  hash.update(Math.random().toString());
  return hash.digest('hex');
};
Author.find = function(id) {
  return function(callback) {
    return Author.db.getDoc(id, function(err, doc) {
      doc || (doc = {});
      doc.db = Author.db;
      return callback(err, new Author(doc));
    });
  };
};
Author.hash_password = function(salt, pass) {
  var hash;
  hash = crypto.createHash('md5');
  hash.update(salt);
  hash.update(pass);
  return hash.digest('hex');
};
exports.Author = Author;