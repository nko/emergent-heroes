var fab = require("./lib/fab")
  , app = require('./lib/app')

with(fab)
(fab)
  (listen, +process.env.PORT || 0xFAB)

  (route, /^\/stylesheets/)
    (route, /^\/(.*)/)
      (app.static.css)
    ()
    ('Not found!')
  ()

  (route, /^\/javascripts/)
    (route, /^\/(.*)/)
      (app.static.js)
    ()
    ('Not found!')
  ()

  (route, /^\/talks/)
    (require('./lib/app-talks'))
  ()

  (route, /^\/create/)
    (app.static.html, 'create')
  ()

  (route, /^\/favicon.ico$/)
    (app.static, 'public', null, 'ico', 'favicon')
  ()

  ('Hi')
()