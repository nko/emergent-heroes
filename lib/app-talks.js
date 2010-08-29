var fab   = require("../vendor/fab")
  , app   = require('./app')
  , Slide = require('./slide').Slide

with(fab) module.exports = (fab)
  (route, /^\/preview/)
    (Slide.previewApp)
  ()
  (route, /^\/([^\/]+)/) // :name
    (route, /^\/slides/)
      (app.static.html, 'slides')
    ()
    (route, /^\/(\d+)/) // :name/:slide_num
      (app.mu, 'form', function(head) {
        return {pres_title: 'abc', body: '# test'}
      })
    ()
    (app.static.html, 'index')
  ()
  (app.redirect_to, "/")
()