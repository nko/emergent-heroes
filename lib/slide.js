var Apricot, Slide, showdown;
var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
showdown = require('../lib/showdown');
Apricot = require('apricot').Apricot;
Slide = function(text, options) {
  this.text = text;
  this.options = options || {};
  return this;
};
Slide.prototype.toHTML = function() {
  return __bind(function(callback) {
    return Slide.parse(this.text)(function(html) {
      return callback(html);
    });
  }, this);
};
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
exports.Slide = Slide;