'use strict'

// remember to type 'thisisunsafe' to make it work -- https://stackoverflow.com/questions/35565278/ssl-localhost-privacy-error
// remember to visit both the inner and outer pages FIRST and type 'thisisunsafe' or 'allow' in Safari

// creating SSL certs -- https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28

// Define the basic imports and constants.
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const port = 5002;

// Get the keys and certs for HTTPS.
const key = fs.readFileSync('./ssl/www-key.pem');
const cert = fs.readFileSync('./ssl/www-cert.pem');


// Setup the outside app with the www folder as static content.
// app.use(express.static('src', {setHeaders: function (res, path, stat) {
//   res.set('Set-Cookie', "embeddedCookie=Hello from an embedded third party cookie!;Path=/;Secure;SameSite=None");
// }}));


// Create the outside app with the first key / cert and run it.
// const server = https.createServer({ key: key, cert: cert }, app);
// server.listen(port, () => {
//   console.log(`Open browser to https://localhost:${port}/ to begin.`);
// });

// // Create the embedded app with the www2 folder as static content and
// // set the cookie from the embedded app in the headers on all requests.
// embeddedApp.use(express.static('src', {
//     setHeaders: function (res, path, stat) {
//       res.set('Set-Cookie', "embeddedCookie=Hello from an embedded third party cookie!;Path=/;Secure;SameSite=None");
//     }
// }));

// // Create the server and start it.
// const embeddedServer = https.createServer({ key: embeddedKey, cert: embeddedCert }, embeddedApp);
// embeddedServer.listen(embeddedPort, () => {
//   console.log(`Embedded server now running on ${embeddedPort}...`)
// });


const url = require('url');
const pathmodule = require('path');


const hostname = 'localhost';
const baseDir = __dirname + "/";
const debug = false;


function logDebugMessage(message) {
    if (debug) {
        console.log(message);
    }
}

function sendFileContent(response, fileName, contentType){
    fileName = baseDir + 'src/' + fileName;
    logDebugMessage(fileName);

    const resolvedPath = pathmodule.resolve(fileName); // resolve will resolve "../"
    if (resolvedPath.startsWith(baseDir + 'src')) {
        fs.readFile(fileName, function(err, data){
            if(err){
                response.writeHead(404);
                response.write("File Not Found!");
            } else{
                response.writeHead(200, {'Content-Type': contentType});
                response.write(data);
            }
            response.end();
        });
    }
}

/**
 * Main Program - Start Server
 */
const server = https.createServer({ key: key, cert: cert },(req, res) => {
    logDebugMessage(req.url);

    res.writeHead(200, {
      'Set-Cookie': "embeddedCookie=Hello from an embedded third party cookie!;Path=/;Secure;SameSite=None"
    });

    if (req.url.includes('.css')) {
        sendFileContent(res, req.url.toString().substring(1), "text/css");
    } else if (req.url.includes('.js')) {
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");
    } else if (req.url.includes('.jpg')) {
        sendFileContent(res, req.url.toString().substring(1), "image/jpg");
    } else if (req.url.includes('.png')) {
        sendFileContent(res, req.url.toString().substring(1), "image/png");
    } else if ((req.url == '/') || (req.url.includes('.html'))) {
        let reqUrl = req.url;
        if (req.url == '/') {
            reqUrl = 'index.html';
        }
        const resolvedPath = pathmodule.resolve(baseDir + 'src/' + reqUrl); // resolve will resolve "../"
        if (resolvedPath.startsWith(baseDir + 'src')) {
            fs.readFile(resolvedPath,function(err,data){
                if(err){
                    res.writeHead(404);
                    res.write("<p>Page Not found.</p>");
                } else{
                    res.writeHead(200, {
                        'Content-Type': 'text/html;charset=UTF8'
                    });
                    res.end(data);
                }
            });
        }
    } else {
        const queryObject = url.parse(req.url,true).query;
        let searchName = '';
        if (queryObject.songName) {
            searchName = queryObject.songName;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        let htmlText = findBySongName(searchName);
        logDebugMessage(htmlText);

        res.end(htmlText);
    }
});

    
server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
