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


function tryParseDateStr(dateStr) {
  var parts = dateStr.split("-");
  if (parts.length < 3) {
    return null
  }
  var dt = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10));
  return dt
}

// my second API endpoint...
app.get("/api/:dateStr", function (req, res) {
  var dt = tryParseDateStr(req.params.dateStr)
  if (dt !== null) {
    res.json({unix: dt.getTime(), utc: dt.toUTCString()});
    return
  }
  var date = new Date(req.params.dateStr * 1);
  res.json({unix: parseInt(req.params.dateStr), utc: date.toUTCString()});
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
