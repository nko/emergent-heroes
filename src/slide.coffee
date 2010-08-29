showdown = require('../lib/showdown')
Apricot  = require('apricot').Apricot

class Slide
  constructor: (text, options) ->
    @text    = text
    @options = options || {}

  toHTML: () ->
    (callback) =>
      Slide.parse(@text) (html) ->
        callback html

Slide.parse = (text) ->
  mkd = showdown.makeHtml text

  (callback) ->
    Apricot.parse mkd, (doc) ->
      doc.find 'pre'
      doc.each (pre) ->
        pre.children.forEach (code) ->
          if code.nodeName != 'CODE'
            return
          lines   = code.text.split("\n")
          langDef = lines.shift()
          if langDef.match(/^@@@/)
            lang = langDef.replace(/^@@@/, '').trim()
            pre.className = "sh_#{lang}"
            code.innerHTML = lines.join("\n")
      callback doc.toHTML

exports.Slide = Slide