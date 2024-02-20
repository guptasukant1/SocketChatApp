// import { createServer } from 'http'
import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
// const httpServer = createServer()

const app = express();

app.use(express.static(path.join(__dirname, "public")));
// * With this we can run the app and the backend both on the express server

const expressServer = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

// const io = new Server(httpServer, {
const io = new Server(expressServer, {
	cors: {
		origin:
			process.env.NODE_ENV === "production"
				? false
				: ["http://localhost:5500", "http://127.0.0.1:5500"],
	},
});

// * The WebSocket protocol is a low-level protocol that allows us to send and receive messages
// * ws cannot deal with the request and response cycle of the HTTP protocol
// * It is a low-level protocol that allows us to send and receive messages
// * It does not broadcast messages to all connected clients

io.on("connection", (socket) => {
	console.log("New connection");
	console.log(`User: ${socket.id} connected`);

	socket.on("message", (data) => {
		console.log(data);
		io.emit("message", `${socket.id.substring(0, 5)}:  ${data}`);
	});
});

// httpServer.listen(3000, ()=>{
//     console.log('Listening on port 3000')
// })

