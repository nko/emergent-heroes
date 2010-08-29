Model  = require './model'

class Presentation extends Model
  # author (ID)
  # title (String)
  # published (boolean, default: false)
  fill: (options) ->
    @db = options.db || Presentation.db
    super options
    @doc.type = 'presentation'
    @doc

  slides: (num) ->
    num = parseInt(num || 0)
    (callback) =>
      startkey = null
      endkey   = null
      if num == 0 # all slides
        startkey = [@id]
        endkey   = [@id, 2]
      else if num == 1 # only first slide
        startkey = [@id]
        endkey   = [@id, 1, 1]
      else # only individual slide
        startkey = [@id, 1, num]
        endkey   = startkey

      @db.view 'slides', 'by_presentation', 
        startkey: startkey
        endkey:   endkey
        (err, data) ->
          if data.rows
            data.rows.forEach
          console.log err, data

Presentation.find = (id, db) ->
  db ||= Presentation.db
  (callback) ->
    db.getDoc id, (err, doc) ->
      doc  ||= {}
      doc.db = db
      callback err, new Presentation doc

Presentation.list = (db) ->
  db ||= Presentation.db
  (callback) ->
    db.view 'slides', 'presentations', {},
      (err, data) ->
        if data.rows
          pres = []
          data.rows.forEach (row) ->
            doc    = row.value
            doc.db = db
            pres.push new Presentation doc
          callback pres
        else
          callback []

Presentation.save = (options) ->
  p = new Presentation options
  (callback) -> p.save() callback

exports.Presentation = Presentation