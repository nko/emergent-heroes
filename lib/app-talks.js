var fab   = require("../vendor/fab")
  , app   = require('./app')
  , sys = require('sys')
  , qs  = require('querystring')
  , Slide = require('./slide').Slide
  , Presentation = require('./presentation').Presentation

with(fab) module.exports = (fab)
  (route, /^\/preview/)
    (Slide.previewApp)
  ()
  (route, /^\/([^\/]+)/) // :name
    (route, /^\/slides/)
      (app.static.html, 'slides')
    ()
    (route, /^\/(\d+)/) // :name/:slide_num
      (method.POST)

      ()
      (app.mu, 'form', function(cb, head) {
        var pres_id = head.captures[0]
        var slide_num = head.captures[1]
        cb({pres_title: 'abc', body: sys.inspect(head), url: '/create'})
      })
    ()
    (app.static.html, 'index')
  ()
  (app.redirect_to, "/")
()