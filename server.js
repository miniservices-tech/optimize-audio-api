const fs = require('fs')
const formidable = require('formidable')
const ffmpeg = require('fluent-ffmpeg')
const express = require('express')
const cryptoRandomString = require('crypto-random-string')
const contentDisposition = require('content-disposition')
const indexPage = require('./IndexPage')
const keys = require('./keys.json')

const PORT = 4090
const HOST = '0.0.0.0'

const app = express()

const jsonRes = (res, o) => {
  res.set('Content-type', 'application/json')
  res.set('Access-Control-Allow-Origin', '*')
  res.send(JSON.stringify(o))
}

const htmlRes = (res, html, code) => {
  res.writeHead(code, {'content-type': 'text/html'})
  res.end(html)
}

const requireKey = ({ query: { key } }) => {
  if (!key || !keys.includes(key)) {
    throw new Error('Invalid key')
  }
}

/**
 * Curl example:
 *
 * curl -F "audio=@/path/to/huge/audio.wav" -XPOST https://optimizeaudio.io/api/convert > optimized.webm
 */
app.post('/api/convert', (req, res) => {
  const form = new formidable.IncomingForm()

  try {
    requireKey(req)
  } catch (e) {
    res.writeHead(403, {'content-type': 'text/json'})
    return res.end(JSON.stringify({
      error: e.message,
    }))
  }

  form.parse(req, (err, fields, files) => {
    const file = Object.values(files)[0]

    if (!file) return jsonRes(res, { error: 'No file' })

    const outputName = `${cryptoRandomString(20)}.webm`
    const outputFilePath = `${process.cwd()}/${outputName}`

    ffmpeg(file.path)
      .audioCodec('vorbis')
      .output(outputName)
      .on('end', () => {
        const readStream = fs.createReadStream(outputFilePath)

        res.set('Content-Disposition', contentDisposition(outputName))

        readStream.pipe(res)

        readStream.on('end', function () {
          fs.unlink(outputFilePath, function (err) {
            if (err) console.log(`had error on deleting file: ${err.message}`)
          })
        })
      })
      .run()
  })
})

app.get('/', (req, res) => htmlRes(res, indexPage(req), 200))

app.get('*', (req, res) => htmlRes(res, 'Not found, <a href="/">Go home</a>', 404))

app.listen(PORT, HOST)

console.log(`Running on http://${HOST}:${PORT}`)
