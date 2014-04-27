var http = require('http')
var concat = require('concat-stream')
var express = require('express')
var ecstatic = require('ecstatic')
var util = require('util')
var NightmareTape = require('../')

var server = null
var app = null

var serverState = {}
var browserState = {}

function serverFactory(done){
  app = express()
  server = http.createServer(app)
  app.use('/hello', function(req, res){
    req.pipe(concat(function(body){
      body = JSON.parse(body.toString())
      serverState.username = body.username
      res.end('world ' + body.username)
    }))
  })
  app.use(ecstatic(__dirname + '/www'))
  server.listen(8080, done)
}

function closeServer(done){
  server.close()
  done && done()
}

NightmareTape(serverFactory, closeServer, function(err, tape){

  tape('trigger an ajax load to /hello', function(t){

    tape.browser
      .goto('http://127.0.0.1:8080')
      .type('input#loginusername', 'rodney')
      .click('button#login')
      .wait(1000)
      .evaluate('getReply', function(val){
        browserState.reply = val
      })
      .run(function (err, nightmare) {
        t.equal(serverState.username, 'rodney')
        t.equal(browserState.reply, 'world rodney')
        t.end()
      });

  })

  tape.shutdown()
})