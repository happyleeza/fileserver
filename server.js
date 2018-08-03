const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const format = require('string-format');
// const json = require('json');
// const prototype = require('prototype');

// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 9000;

http.createServer(function (req, res) {
    //console.log(`${req.method} ${req.url}`);
    // parse URL

    const parsedUrl = url.parse(req.url);
    // extract URL path
	let relative_path = `${parsedUrl.pathname}`;

	if (relative_path=='/')
	{
		// console.log('users want to know the file system structure')

		// var jsdom = require("jsdom");
		// const { JSDOM } = jsdom;
		// const { window } = new JSDOM();
		// const { document } = (new JSDOM('')).window;
		// global.document = document;
		
		// var $ = jQuery = require('jquery')(window);

		let pathname = __dirname + '/data/'
		fs.readdir(pathname, (err, files)=>
		{
			var content = '<html>'
			for (i=0; i<files.length; ++i)
			{
				href = files[i]
				file_path = pathname + files[i]
				if (fs.lstatSync (file_path).isDirectory())
				{
					sub_files = fs.readdirSync(file_path)
					content += '<div>';
					content +=format('{}', files[i]);
					for (j=0; j<sub_files.length; ++j)
					{
						sub_href = files[i]+'/'+sub_files[j]
						content +=format('<div><a href="{}">---{}</a></div>', sub_href, sub_files[j]);
					}
					content += '</div>';
				}
				else
				{
					content +=format('<div><a href="{}">{}</a></div>', href, files[i]);
				}
			}
			content += '</html>';
			res.write(content);
			res.end();
		})


		var car_json_string = '{"src": "foo/bar.jpg", "name":"Lorem ipsum", "value":160000}';
		var car = {type:"Fiat", model:"500", color:"white", src:"a car"};
		// var data = "<html><div><img src='#{src}' /> #{name}</div></html>".in (json);

		res.setHeader('Content-type', 'text/html' );
		// res.write(('<html><div>{}</div></html>').format('Patrick'));
		obj = JSON.parse(car_json_string)
		var content = format('<html><div>{src}</div></html>', obj)
		// res.write(content);
		// res.end();
	}
	else
	{
		let pathname = __dirname + '/data' + relative_path;
		// maps file extention to MIME types
		const mimeType = {
		'.ico': 'image/x-icon',
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.json': 'application/json',
		'.css': 'text/css',
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.wav': 'audio/wav',
		'.mp3': 'audio/mpeg',
		'.svg': 'image/svg+xml',
		'.pdf': 'application/pdf',
		'.doc': 'application/msword',
		'.eot': 'appliaction/vnd.ms-fontobject',
		'.ttf': 'aplication/font-sfnt'
		};
		
		fs.exists(pathname, function (exist) {
			if(!exist) {
				// if the file is not found, return 404
				res.statusCode = 404;
				res.end(`File ${pathname} not found!`);
				return;
			}
			// if is a directory, then look for index.html
			if (fs.statSync(pathname).isDirectory()) {
				pathname += '/index.html';
				// or render the directory structure 
			}

			// read file from file system
			fs.readFile(pathname, function(err, data){
				if(err){
				res.statusCode = 500;
				res.end(`Error getting the file: ${err}.`);
				} else {
				// based on the URL path, extract the file extention. e.g. .js, .doc, ...
				const ext = path.parse(pathname).ext;
				// if the file is found, set Content-type and send data
				res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
				res.end(data);
				}
			});
		});
	}
}).listen(parseInt(port));
console.log(`Server listening on port ${port}`);
