#!/usr/bin/env node

const split = require('split2')
const parseJson = require('fast-json-parse')
const fastJson = require('fast-json-stringify')

const stringifyJson = fastJson({
  type: 'object',
  properties: {
    timestamp: { type: 'string' },
    severity: { type: 'string' },
    message: { type: 'string' },
    meta: { type: 'object', additionalProperties: true },
    responseTime: { type: 'integer' }
  }
})

function winstonStackdriver (line) {
  const { value } = parseJson(line)
  if (value) {
    value.severity = value.level.toUpperCase()
    line = stringifyJson(value)
  }
  return line + '\n'
}

process.stdin.pipe(split(winstonStackdriver)).pipe(process.stdout)
