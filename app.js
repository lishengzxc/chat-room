var express = require('express');
var http = require('http');
var sio = require('socket.io');
var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + "/static/index.html");
});

server.listen(3000);

var socket = sio.listen(server);
socket.on('connection', function (sockect) {
	socket.emit('connected', {hello: "你好"});
	sockect.on('otherEvent', function (data) {
		console.log(data);
	})
});

