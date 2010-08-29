var Model;
var __hasProp = Object.prototype.hasOwnProperty, __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
Model = function(options) {
  this.fill(options);
  return this;
};
Model.prototype.fill = function(options) {
  var _a, key, value;
  this.id = options._id || options.id;
  this.rev = options._rev || options.rev;
  this.db || (this.db = (options.db || Model.db));
  this.doc || (this.doc = {});
  delete options.db;
  delete options.id;
  delete options.rev;
  delete options.ok;
  delete options._id;
  delete options._rev;
  _a = options;
  for (key in _a) {
    if (!__hasProp.call(_a, key)) continue;
    value = _a[key];
    this.doc[key] || (this.doc[key] = options[key]);
  }
  return this.doc;
};
Model.prototype.save = function() {
  return __bind(function(callback) {
    return this.db.saveDoc(this.doc, __bind(function(err, doc) {
      if (!err) {
        this.fill(doc);
      }
      return callback(err, this);
    }, this));
  }, this);
};
Model.couch = require('./couch');
module.exports = Model;