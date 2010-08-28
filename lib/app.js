var fab, fs;
fab = require("./fab");
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
exports.mock = function(write, name) {
  return write(function(write) {
    return fab.stream(function(stream) {
      var file, path;
      path = ("./mocks/" + (name) + ".html");
      file = fs.createReadStream(path);
      file.on('data', function(chunk) {
        return stream(write(chunk));
      });
      return file.on('end', function() {
        return stream(write());
      });
    });
  });
};