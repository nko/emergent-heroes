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
  Presentation.__super__.fill.call(this, options);
  this.doc.type = 'presentation';
  return this.doc;
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
Presentation.list = function(db) {
  db || (db = Presentation.db);
  return function(callback) {
    return db.view('slides', 'presentations', {}, function(err, data) {
      var pres;
      if (data.rows) {
        pres = [];
        data.rows.forEach(function(row) {
          var doc;
          doc = row.value;
          doc.db = db;
          return pres.push(new Presentation(doc));
        });
        return callback(pres);
      } else {
        return callback([]);
      }
    });
  };
};
Presentation.save = function(options) {
  var p;
  p = new Presentation(options);
  return function(callback) {
    return p.save()(callback);
  };
};
exports.Presentation = Presentation;