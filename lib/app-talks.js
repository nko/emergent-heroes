var fab = require("./fab")
  , app = require('./app')

with(fab) module.exports = (fab)
  (route, /^\/([^\/]+)/) // :name
    (route, /^\/slides/)
      (app.mock, 'slides')
    ()
    (route, /^\/(\d+)/) // :name/:slide_num
      (app.mock, 'edit')
    ()
    (app.mock, 'index')
  ()
  (app.redirect_to, "/")
()