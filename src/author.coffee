crypto = require('crypto')

class Author
  constructor: (options) ->
    @fill options

  # id    - The String CouchDB ID.
  # rev   - The String CouchDB revision.
  # name  - The String name for the author.
  # email - The String email address for the author.
  # salt  - The String salt for hashing the password.
  # hash  - A String hashed password.
  fill: (options) ->
    @id  = options._id
    @rev = options._rev
    @db  = options.db || Author.db
    delete options.db
    delete options._id
    delete options._rev
    @doc = options
    @doc.salt ||= @generate_salt()
    @doc

  save: ->
    (callback) =>
      @db.saveDoc @doc, (err, doc) =>
        @fill doc if !err
        callback err, @

  set_password: (pass) ->
    @doc.hash = Author.hash_password @doc.salt, pass

  authenticates: (pass) ->
    Author.hash_password(@doc.salt, pass) == @doc.hash

  generate_salt: ->
    hash = crypto.createHash 'md5'
    hash.update @doc.name
    hash.update @doc.email
    hash.update Math.random().toString() # shoot me
    hash.digest 'hex'

Author.find = (id) ->
  (callback) ->
    Author.db.getDoc id, (err, doc) ->
      doc  ||= {}
      doc.db = Author.db
      callback err, new Author doc

Author.hash_password = (salt, pass) ->
  hash = crypto.createHash 'md5'
  hash.update salt
  hash.update pass
  hash.digest 'hex'

exports.Author = Author