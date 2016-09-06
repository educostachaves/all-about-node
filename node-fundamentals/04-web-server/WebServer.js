'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimes = {
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.jpg': 'image/jpeg',
	'.gif': 'image/gif',
	'.png': 'image/png'
}

function webserver(req, res) {
	// if the route requested is '/', then load 'index.htm' or else
	// load the requested file(s)
	let baseURI = url.parse(req.url, true);
	let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);

	//Check if the requested file is accessible or not
	fs.access(filepath, fs.F_OK , error => {
		if(!error) {
			//Read and Serve the file over response
			fs.readFile(filepath, (error, content) => {
				if(!error) {
					console.log('Serving: ', filepath);
					//Resolve the content type
					let contentType = mimes[path.extname(filepath)] //mimes['.css'] === 'text/css'
					//Server the file from the buffer
					res.writeHead(200, {'content-type': contentType});
					res.end(content, 'utf-8');
				} else {
					res.writeHead(500);
					res.end('Server could not read the file requested!');
				}
			});
		} else {
			//Serve a 404
			res.writeHead(404);
			res.end('Content not found!');
		}
	});
}

http.createServer(webserver).listen(3000, () => {
	console.log('WebServer running on port 3000');
});