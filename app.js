var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + "/static/index.html");
});

server.listen(3000);

var io = require('socket.io').listen(server.listen(3000));

var messages = [];
io.sockets.on('connection',function(socket){
	socket.on('getAllMessages',function(){
		socket.emit('allMessages',messages);
	});
	socket.on('createMessage',function(message){
		messages.push(message);
		io.sockets.emit('messageAdded',message);
	})
});

