# Showoff Time

Showoff Time is a hosted presentation server heavily inspired by Showoff.

* Slides are written in Markdown.
* Generates a Showoff-compatible HTML page with JS navigation.
* Provide a way to present slides by streaming them to users and syncing clicks.
* Import/export showoff talks.

## URLS:

* `/talks/:name#s1234` - view a talk
* `/talks/:name/slides` - long HTML listing of all slides
* `/talks/:name/slides.pdf` - PDF listing of all slides
* `/talks/:name/:slide_num` - edit a specific slide
* `/talks/:name/images/:filename` - uploaded image
* `/create` - create a talk
* `/preview` - render the current data and return it
* `/live/:name#s1234` - view a live talk.

## Model

### Presentation

* author (ID)
* title (String)
* published (boolean, default: false)

### Slide

* presentation (ID)
* number (Integer)
* body (String)
* options (Array, see Slide.validOptions)

### Author

* name
* email
* password

## Development

Run this in the main directory to compile coffeescript to javascript as you go:

    coffee -wc -o lib --no-wrap src/**/*.coffee