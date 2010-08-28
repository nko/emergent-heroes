fab  = require "./fab"
path = require 'path'
fs   = require 'fs'

# Make a temporary redirect to the given url.
#
# write  - A fab downstream writer.
# url    - String URL to redirect to.
# status - Optional Integer of the response status (default: 302)
#
# Returns a fab app.
exports.redirect_to = (write, url, status) ->
  status ||= 302
  write (write) ->
    write(
      "Redirecting to <a href=\"" + url + "\"></a>."
      status: status, headers: {Location: url}
    )

# Renders a static file to the output stream.
#
# write - A fab downstream writer.
# dir   - The String directory to where the file is kept.
# type  - The String content type of the file.
# ext   - The String file extension.
# name  - The String filename.  Add the extension if it doesn't have one already.
#
# Returns a fab app.
exports.static = (write, dir, type, ext, name) ->
  write(undefined, headers: {"Content-Type": type}) (write, head) ->
    filename = name || head.url.capture[0]
    if path.extname(filename) != ".#{ext}"
      filename = "#{name}.#{ext}"
    fab.stream (stream) ->
      io = fs.createReadStream "./#{dir}/#{filename}"
      io.on 'data', (s) -> stream write(s)
      io.on 'end',  ()  -> stream write()

exports.static.html = (write, name) ->
  exports.static write, 'mocks', 'text/html', 'html', name

exports.static.css = (write, name) ->
  exports.static write, 'public/stylesheets', 'text/css', 'css', name

exports.static.js = (write, name) ->
  exports.static write, 'public/javascripts', 'text/js', 'js', name