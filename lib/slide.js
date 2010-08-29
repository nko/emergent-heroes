var Apricot, Model, Presentation, Slide, qs, showdown;
var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  }, __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
Model = require('./model');
Presentation = require('./presentation').Presentation;
showdown = require('../vendor/showdown');
Apricot = require('apricot').Apricot;
qs = require('querystring');
Slide = function(options) {
  Slide.__super__.constructor.call(this, options);
  this.name = "section/slide";
  return this;
};
__extends(Slide, Model);
Slide.prototype.fill = function(options) {
  Slide.__super__.fill.call(this, options);
  this.doc.options || (this.doc.options = []);
  this.doc.type = 'slide';
  return this.doc;
};
Slide.prototype.toHTML = function() {
  var name, wrapper;
  name = ("" + (this.name) + "/" + (this.doc.number || 1));
  wrapper = "<div";
  if (this.doc.slide_id) {
    wrapper += (" id=\"" + (this.doc.slide_id) + "\"");
  }
  wrapper += " class=\"slide\" data-transition=\"none\">";
  wrapper += ("<div class=\"content " + (this.gatherContentClasses().join(" ")) + "\" ref=\"" + (name) + "\">");
  return __bind(function(callback) {
    return Slide.parse(this.doc.body)(function(html) {
      return callback("" + (wrapper) + (html) + "</div></div>");
    });
  }, this);
};
Slide.prototype.gatherContentClasses = function() {
  var classes;
  classes = [];
  this.doc.options.forEach(function(opt) {
    if (Slide.validOptions.indexOf(opt) > -1) {
      return classes.push(opt);
    }
  });
  return classes;
};
Slide.find = function(id, db) {
  db || (db = Slide.db);
  return function(callback) {
    return db.getDoc(id, function(err, doc) {
      doc || (doc = {});
      doc.db = db;
      return callback(err, new Slide(doc));
    });
  };
};
Slide.list = function(presentation, num, db) {
  db || (db = Slide.db);
  num = parseInt(num || 0);
  return function(callback) {
    var endkey, startkey;
    startkey = null;
    endkey = null;
    if (num === 0) {
      startkey = [presentation];
      endkey = [presentation, 2];
    } else if (num === 1) {
      startkey = [presentation];
      endkey = [presentation, 1, 1];
    } else {
      startkey = [presentation, 1, num];
      endkey = startkey;
    }
    return db.view('slides', 'by_presentation', {
      startkey: startkey,
      endkey: endkey
    }, function(err, data) {
      var pres, slides;
      if (data.rows) {
        slides = [];
        pres = null;
        data.rows.forEach(function(row) {
          var doc;
          doc = row.value;
          doc.db = db;
          if (doc.type === 'slide') {
            return slides.push(new Slide(doc));
          } else if (doc.type === 'presentation') {
            return (pres = new Presentation(doc));
          }
        });
        return callback(slides, pres);
      } else {
        return callback([], null);
      }
    });
  };
};
Slide.save = function(options) {
  var s;
  s = new Slide(options);
  return function(callback) {
    return s.toHTML()(function(html) {
      s.doc.html = html;
      return s.save()(callback);
    });
  };
};
Slide.validOptions = ['center', 'full-page', 'bullets', 'smbullets', 'subsection', 'command', 'commandline', 'code', 'incremental', 'small', 'smaller', 'execute'];
Slide.parse = function(text) {
  var mkd;
  mkd = showdown.makeHtml(text);
  return function(callback) {
    return Apricot.parse(mkd, function(doc) {
      doc.find('pre');
      doc.each(function(pre) {
        return pre.children.forEach(function(code) {
          var lang, langDef, lines;
          if (code.nodeName !== 'CODE') {
            return null;
          }
          lines = code.text.split("\n");
          langDef = lines.shift();
          if (langDef.match(/^@@@/)) {
            lang = langDef.replace(/^@@@/, '').trim();
            pre.className = ("sh_" + (lang));
            return (code.innerHTML = lines.join("\n"));
          }
        });
      });
      return callback(doc.toHTML);
    });
  };
};
Slide.previewApp = function(app) {
  return app(function(write, head, body) {
    return fab.stream(function(stream) {
      var text;
      text = '';
      return body(function(chunk) {
        var params;
        if (chunk) {
          return text += chunk.toString('utf8');
        } else {
          params = qs.parse(text);
          return Slide.parse(params.text || '')(function(html) {
            html = ("<div>" + (html) + "</div>");
            stream(write(html));
            return stream(write());
          });
        }
      });
    });
  });
};
exports.Slide = Slide;