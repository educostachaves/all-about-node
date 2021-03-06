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

function fileAcess(filepath) {
	return new Promise((resolve, reject) => {
		fs.access(filepath, fs.F_PK, error => {
			if(!error) {
				resolve(filepath);
			} else {
				reject(error);
			}
		})
	});
}

function fileReader(filepath){
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, (erro, content) => {
			if(!error) {
				resolve(content);
			} else {
				reject(error);
			}
		});
	});
}

function webserver(req, res) {
	// if the route requested is '/', then load 'index.htm' or else
	// load the requested file(s)
	let baseURI = url.parse(req.url, true);
	let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
	let contentType = mimes[path.extname(filepath)] //mimes['.css'] === 'text/css'

	fileAcess(filepath)
		.then(fileReader)
		.then(content => {
			res.writeHead(200, {'content-type': contentType});
			res.end(content, 'utf-8');
		})
		.catch(error => {
			res.writeHead(500);
			res.end(JSON.stringify(error));
		});
}

http.createServer(webserver).listen(3000, () => console.log('WebServer running on port 3000'));