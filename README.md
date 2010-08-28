# Showoff Time

Showoff Time is a hosted presentation server heavily inspired by Showoff.

* Slides are written in Markdown.
* Generates a Showoff-compatible HTML page with JS navigation.
* Provide a way to present slides by streaming them to users and syncing clicks.
* Import/export showoff talks.

URLS:

* `/p/:name#s1234`
* `/p/:name/slides` - long HTML listing of all slides
* `/p/:name/slides.pdf` - PDF listing of all slides
* `/p/:name/edit` - edit a presentation
* `/p/:name/:slide_num` - edit a specific slide
* `/p/:name/images/:filename` - uploaded image
* `/talks/:name#s1234` - view a live talk.