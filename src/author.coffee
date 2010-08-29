crypto = require('crypto')

class Author
  constructor: (options) ->
    @fill options
    @db = options.db || Author.db

  fill: (options) ->
    @name  = options.name
    @email = options.email
    @salt  = options.salt || Author.generate_salt()
    @pw    = options.pw # hashed password

  set_password: (pass) ->
    @pw = Author.hash_password @salt, pass

  authenticates: (pass) ->
    Author.hash_password(@salt, pass) == @pw

Author.generate_salt = ->
  hash = crypto.createHash 'md5'
  hash.update @name
  hash.update @email
  hash.update Math.random().toString() # shoot me
  hash.digest 'hex'

Author.hash_password = (salt, pass) ->
  hash = crypto.createHash 'md5'
  hash.update salt
  hash.update pass
  hash.digest 'hex'

exports.Author = Author