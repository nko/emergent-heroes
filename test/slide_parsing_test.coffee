assert  = require 'assert'
Slide   = require('../lib/slide').Slide
Apricot = require('apricot').Apricot

s = '''
### TITLE

hi there

    @@@ javascript
    var validUsers = [\"damonlindelof\", \"carltoncuse\"]
    function isValidLOSTUser(tweet) {
      var lowerName = tweet.user.screen_name.toLowerCase()
      return validUsers.indexOf(lowerName) > -1
    }

yo

    foo bar
    baz

hmm
'''

slide = new Slide body: s, options: ['center']
slide.toHTML() (html) ->
  Apricot.parse html, (doc) ->
    found = 0
    doc.find 'div'
    doc.each (div) ->
      found += 1
      if found == 1
        assert.equal 'slide', div.className
      else if found == 2
        assert.equal 'content center', div.className
      else
        assert.fail "too many divs"

    doc.find 'h3'
    doc.each (h3) ->
      assert.equal 'TITLE', h3.text.trim()

    found = 0
    doc.find 'pre'
    doc.each (pre) ->
      code = null
      pre.children.forEach (ch) ->
        code = ch if ch.nodeName == 'CODE'
      found += 1
      if found == 1
        assert.equal 'sh_javascript', pre.className
      else if found == 2
        assert.equal "foo bar\nbaz", code.text.trim()
      else
        assert.fail 'too many pre\'s'

    found = 0
    expected = ['hi there', 'yo', 'hmm']
    doc.find 'p'
    doc.each (para) ->
      assert.equal expected[found], para.text.trim()
      found += 1