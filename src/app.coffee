fab  = require "./fab"
path = require 'path'
fs   = require 'fs'
Mu   = require 'Mu'

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

# Renders a mustache template to the output stream.
# 
# write        - A fab downstream writer.
# tmpl_name    - The relative String template name, without the extension.
# dataCallback - A Function that is called with the fab head object and body 
#                callback.  It should return a mustache view object.
#
# Returns a fab app.
exports.mu = (write, tmpl_name, dataCallback) ->
  # compiles the mu template before requests are received
  mu       = null
  muBuffer = ''
  io       = fs.createReadStream "./templates/#{tmpl_name}.mu"
  io.on 'data', (chunk) ->
    muBuffer += chunk
  io.on 'end', ->
    mu       = Mu.compileText muBuffer
    muBuffer = null

  write (write, head, body) ->
    fab.stream (stream) ->
      # get the mustache data
      data = dataCallback head, body
      # render the template
      tmpl = mu data
      tmpl.on 'data', (chunk) ->
        stream write(chunk)
      tmpl.on 'end', ->
        stream write()

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
  write (write, head) ->
    filename = name || head.url.capture[0]
    if path.extname(filename) != ".#{ext}"
      filename = "#{filename}.#{ext}"
    full = "./#{dir}/#{filename}"

    fab.stream (stream) ->
      fs.stat full, (err, stats) ->
        if err
          console.log err
          stream write(
            err
            status: 404
            headers: {"Content-Type": 'text/plain'}
          )
          stream write()
        else
          stream write(
            undefined
            headers:
              'Content-Length': stats.size
              'Content-Type':   type
          )
          io = fs.createReadStream full
          io.on 'data', (s) -> stream write(s)
          io.on 'end',  ()  -> stream write()

exports.static.html = (write, name) ->
  exports.static write, 'mocks', 'text/html', 'html', name

exports.static.css = (write, name) ->
  exports.static write, 'public/stylesheets', 'text/css', 'css', name

exports.static.js = (write, name) ->
  exports.static write, 'public/javascripts', 'text/js', 'js', name

exports.static.png = (write, dir, name) ->
  exports.static write, dir, "image/png", "png", name