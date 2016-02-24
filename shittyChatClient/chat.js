var net = require('net');
var sockets = [];
var s = net.Server(function(socket) {
	sockets.push(socket);

	socket.on('data', function(data) {
		for ( var i = 0; i < sockets.length; i++ ) {
			if (sockets[i] == socket) {
				continue;
			}
			sockets[i].write(data);
			console.log(data);
		}
	});

	socket.on('end', function(){
		var i = sockets.indexOf(socket);
		delete sockets[i];
	});
})

s.listen(8000);