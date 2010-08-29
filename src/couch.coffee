couchdb = require '../vendor/node-couchdb/lib/couchdb'
fs      = require 'fs'
path    = require 'path'

detail_path = process.env.SHOWOFF_TIME_DB || "../secret.js"

try
  stats = fs.statSync detail_path
  exports.details = require(detail_path) || {}
  exports.details.port ||= 80
  exports.details.host ||= 'localhost'
catch err
  console.log "No details file found at #{detail_path}."
  console.log "Set one like this:"
  console.log ""
  console.log "  module.exports ="
  console.log "    { port: 80"
  console.log "    , host: 'technoweenie.couchone.com'"
  console.log "    , user: 'ricky'"
  console.log "    , pass: 'bobby'"
  console.log "    }"

exports.createClient = ->
  couchdb.createClient exports.details.port, 
    exports.details.host, 
    exports.details.user, 
    exports.details.pass

exports.db = (name) ->
  exports.createClient().db name