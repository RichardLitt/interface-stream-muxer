/* eslint-env mocha */
'use strict'

var streamPair = require('stream-pair')

module.exports.all = function (test, common) {
  test('1 stream with 1 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 1, 1)
    })
  })

  test('1 stream with 10 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 1, 10)
    })
  })

  test('1 stream with 100 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 1, 100)
    })
  })

  test('10 stream with 1 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 10, 1)
    })
  })

  test('10 stream with 10 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 10, 10)
    })
  })

  test('10 stream with 100 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 10, 10)
    })
  })

  test('100 stream with 1 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 100, 1)
    })
  })

  test('100 stream with 10 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 100, 10)
    })
  })

  test('100 stream with 100 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 100, 10)
    })
  })

  test('1000 stream with 1 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 1000, 1)
    })
  })

  test('1000 stream with 10 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 1000, 10)
    })
  })

  test('1000 stream with 100 msg', function (t) {
    common.setup(test, function (err, muxer) {
      t.ifError(err, 'should not throw')
      var pair = streamPair.create()

      spawnGeneration(t, muxer, pair, pair.other, 1000, 100)
    })
  })
}

function spawnGeneration (t, muxer, dialerSocket, listenerSocket, nStreams, nMsg, size) {
  t.plan(1 + (5 * nStreams) + (nStreams * nMsg))

  var msg = !size ? 'simple msg' : 'make the msg bigger'

  var listener = muxer(listenerSocket, true)
  var dialer = muxer(dialerSocket, false)

  listener.on('stream', function (stream) {
    t.pass('Incoming stream')
    stream.on('data', function (chunk) {
      t.pass('Received message')
    })

    stream.on('end', function () {
      t.pass('Stream ended on Listener')
      stream.end()
    })
  })

  for (var i = 0; i < nStreams; i++) {
    dialer.newStream(function (err, stream) {
      t.ifError(err, 'Should not throw')
      t.pass('Dialed stream')

      for (var j = 0; j < nMsg; j++) {
        stream.write(msg)
      }

      stream.on('data', function (chunk) {
        t.fail('Should not happen')
      })

      stream.on('end', function () {
        t.pass('Stream ended on Dialer')
      })

      stream.end()
    })
  }
}
