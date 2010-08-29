crypto = require 'crypto'
Model  = require './model'

class Author extends Model
  # id    - The String CouchDB ID.
  # rev   - The String CouchDB revision.
  # name  - The String name for the author.
  # email - The String email address for the author.
  # salt  - The String salt for hashing the password.
  # hash  - A String hashed password.
  fill: (options) ->
    @db = options.db || Author.db
    super options

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