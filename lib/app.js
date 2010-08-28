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
  return write(function(write, head) {
    var filename, full;
    filename = name || head.url.capture[0];
    if (path.extname(filename) !== ("." + (ext))) {
      filename = ("" + (filename) + "." + (ext));
    }
    full = ("./" + (dir) + "/" + (filename));
    return fab.stream(function(stream) {
      return fs.stat(full, function(err, stats) {
        var io;
        if (err) {
          console.log(err);
          stream(write(err, {
            status: 404,
            headers: {
              "Content-Type": 'text/plain'
            }
          }));
          return stream(write());
        } else {
          stream(write(undefined, {
            headers: {
              'Content-Length': stats.size,
              'Content-Type': type
            }
          }));
          io = fs.createReadStream(full);
          io.on('data', function(s) {
            return stream(write(s));
          });
          return io.on('end', function() {
            return stream(write());
          });
        }
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