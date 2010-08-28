# Showoff Time

Showoff Time is a hosted presentation server heavily inspired by Showoff.

* Slides are written in Markdown.
* Generates a Showoff-compatible HTML page with JS navigation.
* Provide a way to present slides by streaming them to users and syncing clicks.
* Import/export showoff talks.

## URLS:

* `/p/:name#s1234`
* `/p/:name/slides` - long HTML listing of all slides
* `/p/:name/slides.pdf` - PDF listing of all slides
* `/p/:name/edit` - edit a presentation
* `/p/:name/:slide_num` - edit a specific slide
* `/p/:name/images/:filename` - uploaded image
* `/create` - create a talk
* `/talks/:name#s1234` - view a live talk.

## Development

Run this in the main directory to compile coffeescript to javascript as you go:

    coffee -wc -o lib --no-wrap src/**/*.coffee