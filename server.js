// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


function validateTimestamp(str) {
  const parsed = parseInt(str, 10);
  return !isNaN(parsed)
}

function validateYYYYMMDD(dateStr) {
  var parts = dateStr.split("-");
  if (parts.length !== 3) {
    return false
  }
  let yyyy = parseInt(parts[0], 10)
  let mm = parseInt(parts[1], 10)
  let dd = parseInt(parts[2], 10)
  if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
    return false
  }
  if (yyyy >= 0 && mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
    return true
  }
  return false
}

function parseYYYYMMDD(str){
  var parts = str.split("-");
  return new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10))
}

function tryParseDateStr(dateStr) {
  if (validateYYYYMMDD(dateStr)) {
    var dt = parseYYYYMMDD(dateStr);
    return [dt, null]
  } else if (validateTimestamp(dateStr)) {
    return [null, null]
  } else {
    return [null, 'Invalid Date']
  }
}

// my second API endpoint...
app.get("/api/:dateStr", function (req, res) {
  var parseRes = tryParseDateStr(req.params.dateStr)
  var dt = parseRes[0]
  var err = parseRes[1]
  if (err !== null) {
    res.json({ error : err })
    return
  }
  if (dt == null) {
    dt = new Date(req.params.dateStr * 1);
  }
  if (dt.toUTCString() === 'Invalid Date') {
    res.json({ error : 'Invalid Date' })
    return
  }
  res.json({unix: dt.getTime(), utc: dt.toUTCString()});
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
