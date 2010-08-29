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