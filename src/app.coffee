fab = require("./fab")
fs  = require('fs')

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

# Display a mock html page.
#
# write - A fab downstream writer.
# name  - String mock filename.  Reads "../mocks/{{name}}.html".
#
# Returns a fab app.
exports.mock = (write, name) ->
  write (write) ->
    fab.stream (stream) ->
      path = "./mocks/#{name}.html"
      file = fs.createReadStream path
      file.on 'data', (chunk) ->
        stream write(chunk)
      file.on 'end', () ->
        stream write()