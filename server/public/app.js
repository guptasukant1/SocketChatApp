// const socket = new WebSocket('ws://localhost:3000')
const socket = io("ws://localhost:3000");
// const socket = io("https://websocketchatapp-wpj0.onrender.com");

const msgInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room");
const activity = document.querySelector(".activity");
const usersList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const chatDisplay = document.querySelector(".chat-display");

function sendMessage(e) {
	e.preventDefault();
	if (msgInput.value && nameInput.value && chatRoom.value) {
		socket.emit("message", {
			name: nameInput.value,
			text: msgInput.value,
		});
		msgInput.value = "";
	}
	msgInput.focus();
}

function enterRoom(e) {
	e.preventDefault();
	if (nameInput.value && chatRoom.value) {
		socket.emit("enterRoom", {
			name: nameInput.value,
			room: chatRoom.value,
		});
	}
}

//* Listen for messages
document.querySelector(".form-msg").addEventListener("submit", sendMessage);

document.querySelector(".form-join").addEventListener("submit", enterRoom);

msgInput.addEventListener("keypress", () => {
	socket.emit("activity", nameInput.value);
});

socket.on("message", (data) => {
	//$ Done to create an entry in the unordered list
	activity.textContent = "";
	const { name, text, time } = data;
	const li = document.createElement("li");
	// li.textContent = data;
	li.className = "post";

	if (name === nameInput.value) li.className = "post post--right";
	if (name !== nameInput.value && name !== "Admin")
		li.className = "post post--left";
	if (name !== "Admin") {
		li.innerHTML = `<div class= "post__header ${
			name === nameInput.value ? "post__header--user" : "post__header--reply"
		}">
		<span class="post__header--name">${name}</span>
		<span class="post__header--time">${time}</span>
		</div>
		<div class="post__text">${text}</div>
		`;
	}
	// * For the Admin
	else {
		li.innerHTML = `<div class="post__text" style="text-align: center">${text}</div>`;
	}
	document.querySelector(".chat-display").appendChild(li);

	chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

let activityTimer;

// $ Listen for activity event and display the name of the user typing
socket.on("activity", (name) => {
	activity.textContent = `${name} is typing...`;
	// $ Clear the timer
	clearTimeout(activityTimer);
	activityTimer = setTimeout(() => {
		activity.textContent = "";
	}, 800);
});

socket.on("userList", ({ users }) => {
	showUsers(users);
});

socket.on("roomList", ({ rooms }) => {
	showRooms(rooms);
});

function showUsers(users) {
	usersList.textContent = "";
	if (users && users.length > 0) {
		usersList.innerHTML = `<em>Users in ${chatRoom.value}: ${users
			.map((user) => user.name)
			.join(", ")}  </em>`;
		// users.foreach((user, i) => {
		// 	usersList.textContent += ` ${user.name}`;
		// 	if (users.length > 1 && i !== users.length - 1) {
		// 		usersList.textContent += ",";
		// 	}
		// });
	}
}

function showRooms(rooms) {
	roomList.textContent = "";
	if (rooms && rooms.length > 0) {
		roomList.innerHTML = `<em>Active Rooms: ${rooms.join(" ,")} </em>`;
		// rooms.foreach((room, i) => {
		// 	roomList.textContent += ` ${room.name}`;
		// 	if (rooms.length > 1 && i !== rooms.length - 1) {
		// 		roomList.textContent += ",";
		// 	}
		// });
	}
}



//* Close the connection (WS)
// const endButton = document.querySelector('.end')

// endButton.addEventListener('click', ()=>{
//     socket.close()
// })

// socket.addEventListener('close', ()=>{
//     console.log('Connection closed')
// })
