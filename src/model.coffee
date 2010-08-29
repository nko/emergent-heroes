class Model
  constructor: (options) ->
    @fill options

  # id    - The String CouchDB ID.
  # rev   - The String CouchDB revision.
  # name  - The String name for the author.
  # email - The String email address for the author.
  # salt  - The String salt for hashing the password.
  # hash  - A String hashed password.
  fill: (options) ->
    @id    = options._id  || options.id
    @rev   = options._rev || options.rev
    @db  ||= options.db   || Model.db
    @doc ||= {}
    delete options.db
    delete options.id
    delete options.rev
    delete options.ok
    delete options._id
    delete options._rev
    for key, value of options
      @doc[key] ||= options[key]
    @doc

  save: ->
    (callback) =>
      console.log 'saving'
      console.log @doc
      @db.saveDoc @doc, (err, doc) =>
        @fill doc if !err
        callback err, @

Model.couch = require './couch'

module.exports = Model