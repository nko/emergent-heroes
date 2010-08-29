assert = require 'assert'
Author = require('../lib/author').Author

author = new Author name: "Name", email: "Email"

assert.equal true,  author.doc.salt?, "No salt"
assert.equal false, author.doc.hash?, "A hash exists"

author.set_password "secret"

assert.equal true,  author.authenticates('secret'), "Valid password doesn't match"
assert.equal false, author.authenticates('foo'),    "Invalid password matches"