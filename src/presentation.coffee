Model  = require './model'

class Presentation extends Model
  # author (ID)
  # title (String)
  # published (boolean, default: false)
  fill: (options) ->
    @db = options.db || Presentation.db
    super options

Presentation.find = (id, db) ->
  db ||= Presentation.db
  (callback) ->
    db.getDoc id, (err, doc) ->
      doc  ||= {}
      doc.db = db
      callback err, new Presentation doc

exports.Presentation = Presentation