const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const port = process.env.PORT || 3000;

const server = http.createServer();
server.on("request", req_handler);
server.on("listening", listen_handler);
server.listen(port);
let resources = [];

//make all the local files public & "sourcable".
fs.readdir("./", (err, files) => {
		resources = files;
		console.log(resources, resources.length);
});

function req_handler(req, res){

	if(req.url === "/" || req.url === "/home"){
		const homepage = fs.createReadStream("index.html");
		res.writeHead(200, { "Content-Type":"text/html" });
		homepage.pipe(res);
	}
	for (var i = resources.length - 1; i >= 0; i--) {
		console.log(`comparing ${req.url} to /${resources[i]}`);
		if(req.url == "/"+resources[i]){
			console.log("creating readStream to: 8puzzle"+ req.url);
			const pp = fs.createReadStream("8puzzle"+ req.url);
			// res.writeHead(200, { "Content-Type":"text/javascript" });
			pp.pipe(res);
			return;
		}
	}
}
function listen_handler(){
	console.log(`listening on port ${port} ,envPort is ${process.env.PORT}`);
}
