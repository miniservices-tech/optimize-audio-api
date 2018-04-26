const title = 'Optimize Audio API'
const description = 'Convert any audio file to the webm format.'

module.exports = ({ query: { subscribe } }) => `
  <!DOCTYPE>
  <html>
  <head>
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css?family=Heebo:400,900" rel="stylesheet">
  </head>
  <body style="font-family: 'Heebo', sans-serif">
  <div style="font-size: 2em; text-align: center; line-height: 1.5; margin-top: 25vh">
    <h1>${title}</h1>
    <p>${description}</p>
    <pre style="padding: 2em; font-size: 0.6em; word-break: break-all">curl -XPOST https://optimizeaudio.miniservices.tech/api/convert?key={...}
    -F "audio=@/path/to/huge.wav" > tiny.webm</pre>
    
    <a href="https://github.com/miniservices-tech/optimize-audio-api" style="margin-right: 0.5em">See source</a>
    <a href="http://eepurl.com/dsND3f">Sign me up</a>
  </div>
  </body>
  </html>
`
