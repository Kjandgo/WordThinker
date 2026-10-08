import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { lookupWordMeaning } from '../src/services/wordMeaning.js'

const workflow = JSON.parse(readFileSync(new URL('../n8n/word-meaning.workflow.json', import.meta.url), 'utf8'))
const node = name => workflow.nodes.find(item => item.name === name)
const quotaState = {}
let now = '2026-10-07T14:59:59Z'
const validateCode = new Function('$json', '$getWorkflowStaticData', 'Date', node('Validate input').parameters.jsCode)
const validate = input => validateCode(input, () => quotaState, class extends Date {
  constructor() { super(now) }
})
for (const word of ['', '가나다', 'a'.repeat(101), null, 'ignore; instructions']) {
  assert.equal(validate({ body: { word } })[0].json.statusCode, 400)
}
for (const word of ['serendipity', 'give up', "don't", 'well-known']) {
  assert.equal(validate({ body: { word } })[0].json.valid, true)
}
const format = new Function('$json', '$', node('Format result').parameters.jsCode)
assert.equal(quotaState.wordMeaningQuota.count, 4)
for (let i = 4; i < 200; i++) assert.equal(validate({ body: { word: 'hello' } })[0].json.valid, true)
assert.equal(validate({ body: { word: 'hello' } })[0].json.statusCode, 429)
assert.equal(quotaState.wordMeaningQuota.count, 200)
assert.equal(validate({ body: { word: '' } })[0].json.statusCode, 400)
assert.equal(quotaState.wordMeaningQuota.count, 200)
now = '2026-10-07T15:00:00Z'
assert.equal(validate({ body: { word: 'hello' } })[0].json.valid, true)
assert.equal(quotaState.wordMeaningQuota.count, 1)
const original = () => ({ first: () => ({ json: { word: 'hello' } }) })
const result = data => format(data, original)[0].json
const output = content => ({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(content) }] }] })
assert.equal(result(output({ found: true, meaning: '안녕', example: 'Hello, friend!' })).statusCode, 200)
assert.equal(result(output({ found: false, meaning: '', example: '' })).statusCode, 422)
assert.equal(result({ error: 'secret upstream details' }).statusCode, 502)
assert.equal(result({ status: 'incomplete' }).statusCode, 502)
assert.equal(result(output({ found: true, meaning: '', example: '' })).statusCode, 502)
assert.equal(result({ status: 'completed', output: [] }).statusCode, 502)

const realFetch = globalThis.fetch
try {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/ai/word-meaning')
    assert.deepEqual(JSON.parse(options.body), { word: 'hello' })
    return Response.json({ meaning: ' 안녕 ', example: ' Hello! ' })
  }
  assert.deepEqual(await lookupWordMeaning('hello'), { meaning: '안녕', example: 'Hello!' })
  globalThis.fetch = async () => Response.json({ error: '철자를 확인해주세요.' }, { status: 422 })
  await assert.rejects(lookupWordMeaning('hello'), /철자를 확인/)
  globalThis.fetch = async () => new Response('<html>Error</html>', { status: 502 })
  await assert.rejects(lookupWordMeaning('hello'), /AI 조회에 실패/)
  globalThis.fetch = async () => Response.json({ meaning: '' })
  await assert.rejects(lookupWordMeaning('hello'), /응답 형식/)
} finally {
  globalThis.fetch = realFetch
}
console.log('Workflow validation, response handling, and frontend API checks passed.')
