var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
var server = app.listen(port, function() {
  console.log("Listening on " + port);
});

// Bound every request so slow-header / slow-body clients cannot park
// sockets on this single-process listener indefinitely. Values are in
// milliseconds; maxConnections caps the total concurrent sockets the
// process will accept so one anonymous client cannot exhaust the FD table.
var REQUEST_TIMEOUT_MS = 30 * 1000;
var HEADERS_TIMEOUT_MS = 15 * 1000;
var SOCKET_TIMEOUT_MS = 30 * 1000;
var MAX_CONNECTIONS = 512;

server.setTimeout(SOCKET_TIMEOUT_MS);
// headersTimeout and requestTimeout only exist on modern Node runtimes
// (>= 11 and >= 14 respectively). Assign defensively so this still runs on
// the legacy node 0.8.x engine declared in package.json.
if (typeof server.headersTimeout !== 'undefined') {
  server.headersTimeout = HEADERS_TIMEOUT_MS;
}
if (typeof server.requestTimeout !== 'undefined') {
  server.requestTimeout = REQUEST_TIMEOUT_MS;
}
server.maxConnections = MAX_CONNECTIONS;

// A malformed request must not be able to kill the sole listener.
server.on('clientError', function(err, socket) {
  try {
    if (socket) {
      socket.destroy();
    }
  } catch (e) {
    // ignore - socket already closed
  }
});

process.on('uncaughtException', function(err) {
  console.error('uncaughtException:', err && err.stack ? err.stack : err);
});
