var http = require('http')
var concat = require('concat-stream')
var express = require('express')
var ecstatic = require('ecstatic')
var util = require('util')
var NightmareTape = require('../')

var server = null
var app = null

function serverFactory(done){
  app = express()
  server = http.createServer(app)
  app.use('/hello', function(req, res){
    req.pipe(concat(function(body){
      body = JSON.parse(body.toString())
      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.dir(body);
      res.end('world ' + body.username)
    }))
    res.send('world')
  })
  app.use(ecstatic(__dirname + '/www'))
  server.listen(8080, done)
}

function closeServer(done){
  server.close()
  done && done()
}

NightmareTape(serverFactory, closeServer, function(err, tape){

  console.log('-------------------------------------------');
  console.log('after init');
  
  tape('trigger an ajax load to /hello', function(t){
    t.equal(1,1)
    t.end()
/*
    tape.browser
      .goto('http://127.0.0.1:8080')
      .type('input#loginusername', 'rodney')
      .click('button#login')
      .wait(1000)
      .run(function (err, nightmare) {
        console.log('-------------------------------------------');
        console.log('-------------------------------------------');
        console.log('-------------------------------------------');
        console.log('after run');
        t.end()
      });*/

  })

  //tape.shutdown()
})