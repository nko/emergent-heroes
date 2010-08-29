Model    = require './model'
Presentation = require('./presentation').Presentation
showdown = require('../vendor/showdown')
Apricot  = require('apricot').Apricot
qs       = require('querystring')

class Slide extends Model
  # presentation (ID)
  # number (Integer)
  # body (String)
  # html (String)
  # options (Array, see Slide.validOptions)
  constructor: (options) ->
    super options
    @name    = "section/slide"

  fill: (options) ->
    super options
    @doc.options ||= []
    @doc.type = 'slide'
    @doc

  toHTML: ->
    name     = "#{@name}/#{@doc.number || 1}"
    wrapper  = "<div"
    wrapper += " id=\"#{@doc.slide_id}\"" if @doc.slide_id
    wrapper += " class=\"slide\" data-transition=\"none\">"
    wrapper += "<div class=\"content #{@gatherContentClasses().join " "}\" ref=\"#{name}\">"
    (callback) =>
      Slide.parse(@doc.body) (html) ->
        callback "#{wrapper}#{html}</div></div>"

  gatherContentClasses: ->
    classes = []
    @doc.options.forEach (opt) ->
      classes.push opt if Slide.validOptions.indexOf(opt) > -1
    classes

Slide.find = (id, db) ->
  db ||= Slide.db
  (callback) ->
    db.getDoc id, (err, doc) ->
      doc  ||= {}
      doc.db = db
      callback err, new Slide doc

Slide.list = (presentation, num, db) ->
  db ||= Slide.db
  num  = parseInt(num || 0)
  (callback) ->
    startkey = null
    endkey   = null
    if num == 0 # all slides
      startkey = [presentation]
      endkey   = [presentation, 2]
    else if num == 1 # only first slide
      startkey = [presentation]
      endkey   = [presentation, 1, 1]
    else # only individual slide
      startkey = [presentation, 1, num]
      endkey   = startkey

    db.view 'slides', 'by_presentation', 
      startkey: startkey
      endkey:   endkey
      (err, data) ->
        if data.rows
          slides = []
          pres   = null
          data.rows.forEach (row) ->
            doc    = row.value
            doc.db = db
            if doc.type == 'slide'
              slides.push new Slide(doc)
            else if doc.type == 'presentation'
              pres = new Presentation doc
          callback slides, pres
        else
          callback [], null

Slide.save = (options) ->
  s = new Slide options
  (callback) -> 
    s.toHTML() (html) ->
      s.doc.html = html
      s.save() callback

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

# Converts the given markdown string to HTML.
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

# An extracted fab app for converting incoming text to markdown.
Slide.previewApp = (app) ->
  # call app with a reference to the downstream app, the request head, and body.
  app (write, head, body) ->
    fab.stream (stream) ->
      text = ''
      # body takes a callback that is called on request.data and request.end 
      # events.
      body (chunk) ->
        if chunk
          text += chunk.toString 'utf8'
        else
          # no data, assume the request has stopped sending data.
          # convert text to showoff markdown html and write it back.
          params = qs.parse(text)
          Slide.parse(params.text || '') (html) ->
            html = "<div>#{html}</div>"
            stream write(html)
            stream write() # close the stream and continue

exports.Slide = Slide