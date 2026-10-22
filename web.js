var express = require('express');

var app = express.createServer(express.logger());

// Do not advertise the framework to clients.
app.disable('x-powered-by');

// Reject malformed percent-encoded query strings with 400 before any
// framework middleware calls decodeURIComponent and throws URIError into
// the default (development-branch) terminal handler.
app.use(function (req, res, next) {
  var qs = req.url.indexOf('?');
  if (qs !== -1) {
    try {
      decodeURIComponent(req.url.substring(qs + 1));
    } catch (e) {
      res.statusCode = 400;
      return res.end('Bad Request');
    }
  }
  next();
});

app.get('/', function(request, response) {
  response.send('Hello World!');
});

// Terminal error handler: log the stack server-side, return a generic
// message/status to the client so err.stack is never written to the body.
app.use(function (err, req, res, next) {
  console.error(err && err.stack ? err.stack : err);
  res.statusCode = 500;
  res.end('Internal Server Error');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
