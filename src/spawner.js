'use strict'

const expect = require('chai').expect

const pair = require('pull-pair/duplex')
const pull = require('pull-stream')
const generate = require('pull-generate')
const eachLimit = require('async/eachLimit')

module.exports = (muxer, nStreams, nMsg, done) => {
  const p = pair()
  const dialerSocket = p[0]
  const listenerSocket = p[1]

  const check = marker((6 * nStreams) + (nStreams * nMsg), done)

  const msg = 'simple msg'

  const listener = muxer.listen(listenerSocket)
  const dialer = muxer.dial(dialerSocket)

  let i = 1
  // let j = 1
  listener.on('stream', (stream) => {
    console.log('stream', i++)
    expect(stream).to.exist
    check()
    pull(
      stream,
      pull.through((chunk) => {
        expect(chunk).to.exist
        // console.log('message', j++)
        check()
      }),
      pull.onEnd((err) => {
        expect(err).to.not.exist
        check()
        pull(pull.empty(), stream)
      })
    )
  })

  const numbers = []
  for (let i = 0; i < nStreams; i++) {
    numbers.push(i)
  }
  eachLimit(numbers, 100, (n, cb) => {
    const stream = dialer.newStream((err) => {
      expect(err).to.not.exist
      check()
      expect(stream).to.exist
      check()

      pull(
        generate(0, (state, cb) => {
          cb(state === nMsg ? true : null, msg, state + 1)
        }),
        stream,
        pull.collect((err, res) => {
          console.log('stream end')
          expect(err).to.not.exist
          check()
          expect(res).to.be.eql([])
          check()
          cb()
        })
      )
    })
  }, () => {})
}

function marker (n, done) {
  let i = 0
  return (err) => {
    i++

    if (err) {
      console.error('Failed after %s iterations', i)
      return done(err)
    }

    if (i === n) {
      done()
    }
  }
}
