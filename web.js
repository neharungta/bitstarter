var express = require('express');

var app = express.createServer();
// Behind the Heroku router: trust exactly one proxy hop so the framework
// resolves the client address from the right-most untrusted X-Forwarded-For
// value instead of the router's socket address.
app.enable('trust proxy');
app.use(express.logger(':req[x-forwarded-for] - :method :url :status :response-time :req[user-agent]'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

// Server-side error logging so failed requests leave a record beyond the
// access log line.
app.use(function(err, request, response, next) {
  console.error(err && err.stack ? err.stack : err);
  next(err);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
