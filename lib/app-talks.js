var fab = require("./fab")
  , app = require('./app')

with(fab) module.exports = (fab)
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