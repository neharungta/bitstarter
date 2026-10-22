var express = require('express');

// Neutralize untrusted request fields before they reach the Logplex stdout
// stream to prevent CWE-117 (log forging / terminal-escape injection).
// Strip C0 controls (incl. 0x1B / CR / LF / DEL), truncate to a bounded
// length, and JSON-escape so quotes in the value cannot terminate the
// quoted log fields of the Apache-combined-style default format.
function safeLogToken(value) {
  if (value === undefined || value === null) return '-';
  var str = String(value);
  // Drop C0 control bytes (0x00-0x1F) and DEL (0x7F); keep printable ASCII
  // plus already-escaped bytes supplied by the client in the URL.
  str = str.replace(/[\x00-\x1F\x7F]/g, '?');
  if (str.length > 512) str = str.slice(0, 512) + '...';
  // JSON.stringify yields a double-quoted, backslash-escaped literal; strip
  // the surrounding quotes so the format string's own quoting still frames
  // the field but any inner quotes/backslashes are escaped.
  var json = JSON.stringify(str);
  return json.substring(1, json.length - 1);
}

var logger = express.logger;
logger.token('url', function(req) { return safeLogToken(req.originalUrl); });
logger.token('referrer', function(req) {
  return safeLogToken(req.headers['referer'] || req.headers['referrer']);
});
logger.token('user-agent', function(req) {
  return safeLogToken(req.headers['user-agent']);
});

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
