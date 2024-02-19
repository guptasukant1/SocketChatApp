const ws = require("ws");
const server = new ws.Server({ port: 3000 });

// * ws cannot deal with the request and response cycle of the HTTP protocol
// * It is a low-level protocol that allows us to send and receive messages
// * It does not broadcast messages to all connected clients
server.on("connection", (socket) => {
	console.log("New connection");
	socket.on("message", (message) => {
		const b = Buffer.from(message);
		console.log("Received: ", b.toString());
		socket.send(`${message}`);
		// console.log(message);
	});
});
// socket.on('close', (close)=>{
//     console.log('Connection closed')
// })

server.on("close", (socket) => {
	socket.close();
	console.log("Connection closed");
});