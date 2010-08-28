var fab = require("./fab")

exports.redirect_to = function(url, status) {
  if(!status) status = 302

  with(fab)
  with(html)

  return (fab)
    ("Redirecting to ", {status: status, headers: {Location: url}})
    (A, {href: url})(url)()
    (".")
  ()
}