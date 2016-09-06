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

// let routes = {
// 	'GET': {
// 		'/': (req, res) => {
// 			res.writeHead(200, {'content-type': 'text/html'});
// 			res.end('<h1>Hello Router</h1>');
// 		},
// 		'/about': (req, res) => {
// 			res.writeHead(200, {'content-type': 'text/html'});
// 			res.end('<h1>About page</h1>');
// 		},
// 		'/api/getinfo': (req, res) => {
// 			res.writeHead(200, {'content-type': 'text/html'});
// 			res.end(JSON.stringify(req.queryParams));
// 		},
// 	},
// 	'POST': {
// 		'/api/login': (req, res) => {
// 			let body = '';
// 			req.on('data', data => {
// 				body += data;
// 				if(body.length > 2097152) {
// 					res.writeHead(413, {'content-type': 'text/html'});
// 					res.end('<h3>Error: The file being uploaded exceeds the 2MB limit</h3>',
// 						() => req.connection.destroy());
// 				}
// 			});

// 			req.on('end', () => {
// 				let params = qs.parse(body);
// 				console.log('username:', params['username']);
// 				console.log('password:', params['password']);
// 				res.end();
// 			});
// 		}
// 	},
// 	'NA':(req, res) => {
// 		res.writeHead(404);
// 		res.end('Content not found!');
// 	}
// }

function webserver(req, res) {
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

	/*let resolveRoute = routes[req.method][baseURI.pathname];
	if(resolveRoute != undefined) {
		req.queryParams = baseURI.query;
		resolveRoute(req,res);
	} else {
		routes['NA'](req,res);
	}*/
}

http.createServer(webserver).listen(3000, () => {
	console.log('WebServer running on port 3000');
});