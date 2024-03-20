// import { createServer } from 'http'
import express from "express";
import { Server } from "socket.io";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { time } from "node:console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const ADMIN = "Admin";
// const httpServer = createServer()

const app = express();

app.use(express.static(path.join(__dirname, "public")));
// * With this we can run the app and the backend both on the express server

const expressServer = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

// $ State for users
const UsersState = {
	users: [],
	setUsers: function (newUsersArray) {
		this.users = newUsersArray;
	},
};

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

// $ For socket.on or io.on it means that we are working with a listener

io.on("connection", (socket) => {
	console.log("New connection");
	console.log(`User: ${socket.id} connected`);

	// ! Upon connection, we send a message to the said user
	socket.emit("message", buildMsg(ADMIN, "Welcome to the chat"));

	// $ Manages the user joining a room, removing their entry from the previous room, sending relevant messages for the same
	socket.on("enterRoom", ({ name, room }) => {
		// * Remove the user from the previous room if they were in any
		const prevRoom = getUser(socket.id)?.room;
		if (prevRoom) {
			socket.leave(prevRoom);
			io.to(prevRoom).emit(
				"message",
				buildMsg(ADMIN, `${name} has left the room`),
			);
		}
		const user = activateUser(socket.id, name, room);

		if (prevRoom) {
			io.to(prevRoom).emit("userList", { users: getUsersInRoom(prevRoom) });
		}

		// * Join the user to the new room
		socket.join(user.room);

		// * Send a message to the user that the user has joined a specific room | Send a message to the room that the user has joined
		socket.emit("message", buildMsg(ADMIN, `You have joined ${user.room}`));
		socket.broadcast
			.to(user.room)
			.emit("message", buildMsg(ADMIN, `${user.name} has joined the room`));

		// * Send the list of users in the room to the user
		io.to(user.room).emit("userList", { users: getUsersInRoom(user.room) });

		// * Send the list of rooms to all users
		io.emit("roomList", { rooms: getAllActiveRooms() });
	});

	// ! When user disconnects, the others are informed
	socket.on("disconnect", () => {
		const user = getUser(socket.id);
		userLeaves(socket.id);

		if (user) {
			io.to(user.room).emit(
				"message",
				buildMsg(ADMIN, `${user.name} has left the room`),
			);
			io.to(user.room).emit("userList", { users: getUsersInRoom(user.room) });

			io.emit('roomList', {rooms: getAllActiveRooms()})
		}
		// socket.broadcast.emit(
		// 	"message",
		// 	`User ${socket.id.substring(0, 5)} has left the chat`,
		// );
		console.log(`User ${socket.id.substring(0, 5)} has left the chat`);
	});

	// ! We broadcast to all connected clients that the current user joined
	socket.broadcast.emit(
		"message",
		`User: ${socket.id.substring(0, 5)} joined the chat`,
	);

	// ! We listen for the message event
	socket.on("message", ({name, text}) => {
		const room = getUser(socket.id)?.room
		if(room){
			io.to(room).emit('message', buildMsg(name, text))
		}
		console.log(name, text);
		// console.log(text);
		// io.emit("message", `${socket.id.substring(0, 5)}:  ${data}`);
	});


	// ! We listen for the activity event
	socket.on("activity", (name) => {
		const room = getUser(socket.id)?.room
		if(room){
			// socket.broadcast.to(room).emit('activity', name)
			io.to(room).emit("activity", name);
		}
		// socket.broadcast.emit("activity", name);
	});

	socket.on("connected", () => {
		io.emit(`Users in the room: ${socket.id.substring(0, 5)}`);
	});
});

// $ Build the message to be displayed
function buildMsg(name, text) {
	const now = new Date();
	const time = now.toLocaleTimeString([], {
		hour: "numeric",
		minute: "numeric",
	});
	return {
		name,
		text,
		time,
	};
}

// * User Functions
function activateUser(id, name, room) {
	const user = { id, name, room };
	UsersState.setUsers([
		...UsersState.users.filter((user) => user.id !== id),
		user,
	]);
	return user;
}

function userLeaves(id) {
	UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
}

function getUser(id) {
	return UsersState.users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
	return UsersState.users.filter((user) => user.room === room);
}

function getAllActiveRooms() {
	return Array.from(new Set(UsersState.users.map((user) => user.room)));
}



// httpServer.listen(3000, ()=>{
//     console.log('Listening on port 3000')
// })

