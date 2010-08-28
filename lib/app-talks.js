var fab = require("./fab")
  , app = require('./app')

with(fab) module.exports = (fab)
  (route, /^\/([^\/]+)/) // :name
    ('p: ')(route.capture, 0)('.')
    (route, /^\/(\d+)/) // :name/:slide_num
      ("\nslide: ")(route.capture, 1)('.')
    ()
    ("\n ship it")
  ()
  (app.redirect_to, "/")
()