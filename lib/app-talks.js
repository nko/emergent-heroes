var fab = require("./fab")
  , app = require('./app')
  , Slide = require('./slide').Slide

with(fab) module.exports = (fab)
  (route, /^\/preview/)
    (function(write) {
      return write(function(write, head, body) {
        return fab.stream(function(stream) {
          var text = ''
          body(function(chunk) {
            if(chunk)
              text += chunk.toString('utf8')
            else {
              Slide.parse(text)(function(html) {
                stream(write(html))
                stream(write())
              })
            }
          })
        })
      })
    })
  ()
  (route, /^\/([^\/]+)/) // :name
    (route, /^\/slides/)
      (app.static.html, 'slides')
    ()
    (route, /^\/(\d+)/) // :name/:slide_num
      (app.static.html, 'edit')
    ()
    (app.static.html, 'index')
  ()
  (app.redirect_to, "/")
()