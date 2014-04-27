var util = require('util')
var Nightmare = require('nightmare')
var tape     = require('tape')

function TapeNightmare (options) {
  options = options || {}
  options.timeout = options.timeout || 5000
  options.interval = options.interval || 50
  this._queue = [];
  this._executing = false;  
  return this;
}

util.inherits(TapeNightmare, Nightmare)

TapeNightmare.prototype.setup = function (cb) {
  var self = this;
  this.setupInstance(function (instance) {
    instance.createPage(function(page) {
      self.page = page;
      self.instance = instance
      cb()
    })
  })
}

TapeNightmare.prototype.close = function(cb) {
  this.instance.exit(0)
}

module.exports = function(serverFactory, closeServer, done){

  tape('create server & browser', function(t){
    serverFactory(function(err){
      tape.browser = new TapeNightmare()
      tape.browser.setup(function(){
        t.end()
      })
    })    
  })

  tape.shutdown = function(){
    tape('shutdown server & browser', function(t){
      closeServer(function(){
        console.log('-------------------------------------------');
        console.log('after close');

        t.end()
        tape.browser.close()
      })
    })
  }

  done(null, tape)
}