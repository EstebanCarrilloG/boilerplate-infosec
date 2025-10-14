const express = require("express");
const app = express();
const helmet = require("helmet");

module.exports = app;
const api = require("./server.js");
app.use(helmet.hidePoweredBy());
// setting "X-Frame-Options" to "DENY"
app.use(
  helmet.frameguard({
    action: "deny",
  })
);
//sanitize input sent to the server
app.use(helmet.xssFilter());
//set X-Content-Type-Options header to nosniff
app.use(helmet.noSniff());
//prevent IE users from executing downloads in the trusted site's context.
app.use(helmet.ieNoOpen());
//asks Browsers to Access via HTTPS Only
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;
app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds, force: true }));
//Sets "X-DNS-Prefetch-Control: off"
app.use(helmet.dnsPrefetchControl());
//disable client-side caching.
app.use(helmet.noCache());
//Setting and configuring a Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  })
);

/*

Helmet Using the ‘parent’ helmet() Middleware

app.use(helmet()) will automatically include all 
the middleware introduced above, except noCache(), 
and contentSecurityPolicy(), but these can be 
enabled if necessary. You can also disable or 
configure any other middleware individually, 
using a configuration object.

Example: 

app.use(helmet({
  frameguard: {         // configure
    action: 'deny'
  },
  contentSecurityPolicy: {    // enable and configure
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ['style.com'],
    }
  },
  dnsPrefetchControl: false     // disable
}))*/

app.use(express.static("public"));
app.disable("strict-transport-security");
app.use("/_api", api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
