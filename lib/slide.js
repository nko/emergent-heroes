var Apricot, Slide, qs, showdown;
var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
showdown = require('../lib/showdown');
Apricot = require('apricot').Apricot;
qs = require('querystring');
Slide = function(text, option_list) {
  this.text = text;
  this.options = option_list || {};
  this.name = "section/slide";
  return this;
};
Slide.prototype.toHTML = function(num) {
  var name, wrapper;
  name = ("" + (this.name) + "/" + (num));
  wrapper = "<div";
  if (this.options.id) {
    wrapper += (" id=\"" + (this.options.id) + "\"");
  }
  wrapper += (" class=\"slide\" data-transition=\"" + (this.options.transition || 'none') + "\">");
  wrapper += ("<div class=\"content " + (this.gatherContentClasses().join(" ")) + "\" ref=\"" + (name) + "\">");
  return __bind(function(callback) {
    return Slide.parse(this.text)(function(html) {
      return callback("" + (wrapper) + (html) + "</div></div>");
    });
  }, this);
};
Slide.prototype.gatherContentClasses = function() {
  var classes;
  classes = [];
  this.options.forEach(function(opt) {
    if (Slide.validOptions.indexOf(opt) > -1) {
      return classes.push(opt);
    }
  });
  return classes;
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