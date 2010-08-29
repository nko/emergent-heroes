var fab = require("./vendor/fab")
  , app = require('./lib/app')
  , sys = require('sys')
  , qs  = require('querystring')
  , Slide = require('./lib/slide').Slide
  , Presentation = require('./lib/presentation').Presentation

with(fab)
(fab)
  (listen, +process.env.PORT || 0xFAB)

  (route, /^\/stylesheets/)
    (route, /^\/theme\/images\/(.*)$/)
      (app.static.png, "public/stylesheets/theme/images")
    ()
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
    (method.POST)
      (function (app) {
        return app(function(write, head, body) {
          return fab.stream(function(stream) {
            var s = ''
            body(function(chunk) {
              if(chunk) {
                s += chunk
              } else {
                var params = qs.parse(s)
                var db = Model.couch.db('slides')
                Presentation.save(
                { db: db
                , author: params.author || "Anonymous"
                , title:  params.title  || "Untitled"
                })(function(err, pres) {
                  Slide.save(
                  { db: db
                  , presentation: pres.id
                  , number: params.number || 1
                  , body: params.body
                  })(function(err, s) {
                    stream(write(sys.inspect(params) + "\n\n"))
                    stream(write(sys.inspect(s)))
                    stream(write())
                  })
                })
              }
            })
          })
        })
      })
    ()
    (app.mu, 'form', function(cb, head) {
      cb({edit_pres: true, number: 1})
    })
  ()

  (route, /^\/favicon.ico$/)
    (app.static, 'public', null, 'ico', 'favicon')
  ()

  ('Hi')
()