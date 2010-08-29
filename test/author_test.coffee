assert = require 'assert'
Author = require('../lib/author').Author

author = new Author name: "Name", email: "Email"

assert.equal true,  author.salt?
assert.equal false, author.pw?

author.set_password "secret"

assert.equal true,  author.authenticates('secret')
assert.equal false, author.authenticates('foo')