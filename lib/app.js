var fab, fs, path;
fab = require("./fab");
path = require('path');
fs = require('fs');
exports.redirect_to = function(write, url, status) {
  status || (status = 302);
  return write(function(write) {
    return write("Redirecting to <a href=\"" + url + "\"></a>.", {
      status: status,
      headers: {
        Location: url
      }
    });
  });
};
exports.static = function(write, dir, type, ext, name) {
  return write(undefined, {
    headers: {
      "Content-Type": type
    }
  })(function(write, head) {
    var filename;
    filename = name || head.url.capture[0];
    if (path.extname(filename) !== ("." + (ext))) {
      filename = ("" + (name) + "." + (ext));
    }
    return fab.stream(function(stream) {
      var io;
      io = fs.createReadStream("./" + (dir) + "/" + (filename));
      io.on('data', function(s) {
        return stream(write(s));
      });
      return io.on('end', function() {
        return stream(write());
      });
    });
  });
};
exports.static.html = function(write, name) {
  return exports.static(write, 'mocks', 'text/html', 'html', name);
};
exports.static.css = function(write, name) {
  return exports.static(write, 'public/stylesheets', 'text/css', 'css', name);
};
exports.static.js = function(write, name) {
  return exports.static(write, 'public/javascripts', 'text/js', 'js', name);
};
exports.static.png = function(write, dir, name) {
  return exports.static(write, dir, "image/png", "png", name);
};