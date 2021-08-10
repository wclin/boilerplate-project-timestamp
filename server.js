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
  if (isNaN(parsed)) {
    return false
  }
  let dt = new Date(parsed);
  return dt.toUTCString() !== 'Invalid Date'
}

function validateDateStr(str) {
  let dt = new Date(str);
  return dt.toUTCString() !== 'Invalid Date'
}

function tryParseDateStr(dateStr) {
  var dt;
  if (dateStr == undefined) {
    dt = new Date();
  } else if (validateDateStr(dateStr)) {
    dt = new Date(dateStr);
  } else if (validateTimestamp(dateStr)) {
    dt = new Date(dateStr * 1);
  } else {
    return [null, 'Invalid Date']
  }
  return [dt, null]
}

// my second API endpoint...
app.get("/api/:dateStr?", function (req, res) {
  var parseRes = tryParseDateStr(req.params.dateStr)
  var dt = parseRes[0];
  var err = parseRes[1];
  if (err !== null) {
    res.json({ error : err });
    return
  }
  res.json({unix: dt.getTime(), utc: dt.toUTCString()});
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
