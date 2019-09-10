const { join } = require('path')
const { Readable } = require('stream')
const { test } = require('@ianwalter/bff')
const execa = require('execa')

const winstonStackdriver = join(__dirname, '../')
const lineOne = JSON.stringify({
  timestamp: '2019-09-10T01:15:12.511Z',
  level: 'debug',
  message: 'Not attempting to create collection'
}) + '\n'
const lineTwo = JSON.stringify({
  timestamp: '2019-09-10T01:15:12.559Z',
  level: 'info',
  message: 'Applied validation schema to willy wonka'
}) + '\n'

test('severity is added to log entry', ({ expect }) => {
  return new Promise(resolve => {
    const stdin = new Readable({ read () {} })
    const cp = execa('node', [winstonStackdriver])
    let counter = 0
    cp.stdout.on('data', data => {
      expect(JSON.parse(data)).toMatchSnapshot()
      if (counter) {
        resolve()
      } else {
        counter++
      }
    })
    stdin.pipe(cp.stdin)
    stdin.push(lineOne)
    stdin.push(lineTwo)
    stdin.push(null) // Push null to close the stream.
  })
})
