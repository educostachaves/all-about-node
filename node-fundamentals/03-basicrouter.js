'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');

let routes = {
	'GET': {
		'/': (req, res) => {
			res.writeHead(200, {'content-type': 'text/html'});
			res.end('<h1>Hello Router</h1>');
		},
		'/about': (req, res) => {
			res.writeHead(200, {'content-type': 'text/html'});
			res.end('<h1>About page</h1>');
		},
		'/api/getinfo': (req, res) => {
			res.writeHead(200, {'content-type': 'text/html'});
			res.end(JSON.stringify(req.queryParams));
		},
	},
	'POST': {
		'/api/login': (req, res) => {
			let body = '';
			req.on('data', data => {
				body += data;
				if(body.length > 2097152) {
					res.writeHead(413, {'content-type': 'text/html'});
					res.end('<h3>Error: The file being uploaded exceeds the 2MB limit</h3>',
						() => req.connection.destroy());
				}
			});

			req.on('end', () => {
				let params = qs.parse(body);
				console.log('username:', params['username']);
				console.log('password:', params['password']);
				res.end();
			});
		}
	},
	'NA':(req, res) => {
		res.writeHead(404);
		res.end('Content not found!');
	}
}

function router(req, res) {
	let baseURI = url.parse(req.url, true);
	let resolveRoute = routes[req.method][baseURI.pathname];
	if(resolveRoute != undefined) {
		req.queryParams = baseURI.query;
		resolveRoute(req,res);
	} else {
		routes['NA'](req,res);
	}
}

http.createServer(router).listen(3000, () => {
	console.log('Server running on port 3000');
});