var Author, crypto;
var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
crypto = require('crypto');
Author = function(options) {
  this.fill(options);
  return this;
};
Author.prototype.fill = function(options) {
  this.id = options._id;
  this.rev = options._rev;
  this.db = options.db || Author.db;
  delete options.db;
  delete options._id;
  delete options._rev;
  this.doc = options;
  this.doc.salt || (this.doc.salt = this.generate_salt());
  return this.doc;
};
Author.prototype.save = function() {
  return __bind(function(callback) {
    return this.db.saveDoc(this.doc, __bind(function(err, doc) {
      if (!err) {
        this.fill(doc);
      }
      return callback(err, this);
    }, this));
  }, this);
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