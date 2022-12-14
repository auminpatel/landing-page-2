// Define the basic imports and constants.
const fs = require('fs');
const http = require('http');
const port = 5002;

// // Get the keys and certs for HTTPS.
// const key = fs.readFileSync('./ssl/www-key.pem');
// const cert = fs.readFileSync('./ssl/www-cert.pem');




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
    fileName = baseDir + 'html/' + fileName;
    logDebugMessage(fileName);

    const resolvedPath = pathmodule.resolve(fileName); // resolve will resolve "../"
    if (resolvedPath.startsWith(baseDir + 'html')) {
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
const server = http.createServer((req, res) => {
    logDebugMessage(req.url);


    // res.setHeader('Set-Cookie','visited=true; Max-Age=3000; HttpOnly, Secure');

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

       
        const resolvedPath = pathmodule.resolve(baseDir + 'html/' + reqUrl); // resolve will resolve "../"
        if (resolvedPath.startsWith(baseDir + 'html')) {
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
    }else {

    console.log('Creating Cookie');

    var cookie = {
      "some": "data"
    };

    res.writeHead(200, {'Set-Cookie': cookie, 'Content-Type': 'text/plain'});

    res.end();
  }
});

    
server.listen(port, () => {
    console.log(`Server running at https://${hostname}:${port}/`);
});
