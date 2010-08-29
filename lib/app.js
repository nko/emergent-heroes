var Mu, fab, fs, path;
fab = require("../vendor/fab");
path = require('path');
fs = require('fs');
Mu = require('../vendor/Mu');
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
exports.mu = function(write, tmpl_name, dataCallback) {
  var io, mu, muBuffer;
  mu = null;
  muBuffer = '';
  io = fs.createReadStream("./templates/" + (tmpl_name) + ".mu");
  io.on('data', function(chunk) {
    return muBuffer += chunk;
  });
  io.on('end', function() {
    mu = Mu.compileText(muBuffer);
    return (muBuffer = null);
  });
  return write(function(write, head, body) {
    return fab.stream(function(stream) {
      var callback;
      callback = function(data) {
        var tmpl;
        tmpl = mu(data);
        tmpl.on('data', function(chunk) {
          return stream(write(chunk));
        });
        return tmpl.on('end', function() {
          return stream(write());
        });
      };
      return dataCallback(callback, head, body);
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