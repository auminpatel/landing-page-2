// const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();
const port = 5005;

// Setup the outside app with the www folder as static content.
app.use(express.static('html', {setHeaders: function (res, path, stat) {
  res.set('Set-Cookie', "embeddedCookie=Hello from an embedded third party cookie!;Path=/;Secure;SameSite=None");
}}));


// Create the outside app with the first key / cert and run it.
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Open browser to http://localhost:${port}/ to begin.`);
});