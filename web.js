var express = require('express');

// SECURITY NOTE (access control posture):
// This app is the heroku/node-js-sample skeleton. The sole route GET / is
// intentionally public and returns only a constant string literal
// ("Hello World!"): it reads no identity, no datastore, and no request
// state, and performs no side effect beyond request logging. There is
// deliberately no application-level authn/authz middleware mounted here.
//
// Important for future contributors: because no gate is mounted, any new
// route added below inherits zero access control and will be reachable by
// any anonymous internet client. Do not add a route that reads user data,
// mutates state, or exposes privileged information without first either
// mounting an explicit app-level gate here (fail-closed, with an explicit
// public allowlist such as ['/', '/healthz']) or enforcing authentication
// at the platform edge (gateway authorizer, OIDC proxy, or mTLS) and
// validating the resulting identity header over a trusted-proxy config.
// See README.md for details.
var app = express.createServer(express.logger());

// Public by design: landing page, no data, no identity consulted.
app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
