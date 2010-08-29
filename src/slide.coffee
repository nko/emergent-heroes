showdown = require('../lib/showdown')
Apricot  = require('apricot').Apricot

class Slide
  constructor: (text, option_list) ->
    @text    = text
    @options = option_list || {}
    @name    = "section/slide"

  toHTML: (num) ->
    name     = "#{@name}/#{num}"
    wrapper  = "<div"
    wrapper += " id=\"#{@options.id}\"" if @options.id
    wrapper += " class=\"slide\" data-transition=\"#{@options.transition || 'none'}\">"
    wrapper += "<div class=\"content #{@gatherContentClasses().join " "}\" ref=\"#{name}\">"
    (callback) =>
      Slide.parse(@text) (html) ->
        callback "#{wrapper}#{html}</div></div>"

  gatherContentClasses: ->
    classes = []
    @options.forEach (opt) =>
      classes.push opt if Slide.validOptions.indexOf(opt) > -1
    classes

Slide.validOptions = [
  'center'
  'full-page'
  'bullets'
  'smbullets'
  'subsection'
  'command'
  'commandline'
  'code'
  'incremental'
  'small'
  'smaller'
  'execute'
  ]

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