var Model, Presentation;
var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
Model = require('./model');
Presentation = function() {
  return Model.apply(this, arguments);
};
__extends(Presentation, Model);
Presentation.prototype.fill = function(options) {
  this.db = options.db || Presentation.db;
  return Presentation.__super__.fill.call(this, options);
};
Presentation.find = function(id, db) {
  db || (db = Presentation.db);
  return function(callback) {
    return db.getDoc(id, function(err, doc) {
      doc || (doc = {});
      doc.db = db;
      return callback(err, new Presentation(doc));
    });
  };
};
exports.Presentation = Presentation;