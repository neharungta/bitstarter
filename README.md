# node-js-sample

A sample Node.js app.

## Running

    npm install
    node web.js

## Access control posture

This app is public by default and by design. GET / is a landing page
that returns the constant string Hello World!. It reads no request
state and performs no side effect.

No application-level auth middleware is mounted in web.js. This is a
deliberate, documented decision for this skeleton.

Any new route added to web.js will be reachable by any anonymous
client unless its author protects it. Before adding a route that
reads user data or mutates state, you must either mount an explicit
app-level gate (fail-closed, with a public allowlist such as ['/',
'/healthz']) or enforce authentication at the platform edge and
validate the resulting identity header over a trusted-proxy config.
