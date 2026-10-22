var express = require('express');

var app = express.createServer(express.logger());

// Force production mode so the framework's default terminal handler
// emits a generic body ("Internal Server Error") instead of err.stack.
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
app.set('env', 'production');

// Disable framework fingerprinting (X-Powered-By: Express).
app.disable('x-powered-by');

app.get('/', function(request, response) {
  response.send('Hello World!');
});

// Explicit catch-all 404 so unrouted paths/methods are not answered by
// framework defaults ("Cannot <METHOD> <path>").
app.use(function(request, response) {
  response.send(404, 'Not Found');
});

// Application error handler as the last middleware: log server-side,
// return a constant generic body to the client. The 4-argument signature
// is recognised as an error handler by Connect/Express.
app.use(function(err, request, response, next) {
  console.error(err && err.stack ? err.stack : err);
  response.send(500, 'Internal Server Error');
});

// Guard the single-process server against asynchronously-thrown errors
// that Connect's synchronous try/catch does not cover.
process.on('uncaughtException', function(err) {
  console.error('uncaughtException:', err && err.stack ? err.stack : err);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
