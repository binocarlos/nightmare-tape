nightmare-tape
==============

A wrapper for nightmare and tape for node.js full stack tests

## install

```
$ npm install nightmare-tape --save-dev
```

## usage

You create tape tests as normal but inside a wrapper that provides a hooked up nightmare browser.

You pass a function which will create the server and another to close it down.

```js
var http = require('http')
var concat = require('concat-stream')
var express = require('express')
var ecstatic = require('ecstatic')
var util = require('util')
var NightmareTape = require('../')

var server = null
var app = null

var serverState = {}

function serverFactory(done){
  app = express()
  server = http.createServer(app)
  app.use('/hello', function(req, res){
    req.pipe(concat(function(body){
      body = JSON.parse(body.toString())
      serverState.username = body.username
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

  tape('trigger an ajax load to /hello', function(t){

    tape.browser
      .goto('http://127.0.0.1:8080')
      .type('input#loginusername', 'rodney')
      .click('button#login')
      .wait(1000)
      .run(function (err, nightmare) {
        t.equal(serverState.username, 'rodney')
        t.end()
      });

  })

  tape.shutdown()
})
```

## license

MIT