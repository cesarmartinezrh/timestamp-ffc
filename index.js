// index.js
// where your node app starts

// init project
var express = require('express')
var app = express()
require('dotenv').config()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors')
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/api', (req, res) => {
  const unixDate = Date.now()
  const utcDate = new Date(Date.now()).toUTCString()
  res.json({ unix: unixDate, utc: utcDate })
})

app.get('/api/:date?', (req, res) => {
  const DATE_YYYY_MM_DD_Regexp = new RegExp(
    /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
  )
  const DATE = req.params.date
  const parsedDate = parseInt(DATE)
  const regExpDate = DATE_YYYY_MM_DD_Regexp.test(DATE)
  const unixDate = /^\d+$/.test(DATE)
  if (regExpDate === false && unixDate === false)
    return res.json({ error: 'Invalid Date' })
  if (regExpDate) {
    const splittedDate = DATE.split('-')
    const unixDate = new Date(
      Date.UTC(splittedDate[0], splittedDate[1] - 1, splittedDate[2])
    )
    const utcDate = new Date(
      Date.UTC(splittedDate[0], splittedDate[1] - 1, splittedDate[2])
    ).toUTCString()
    return res.json({ unix: Number(unixDate), utc: utcDate })
  }
  if (unixDate) {
    const utcDate = new Date(parsedDate).toUTCString()
    return res.json({ unix: parsedDate, utc: utcDate })
  }
})

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
