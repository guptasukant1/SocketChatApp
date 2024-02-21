// const socket = new WebSocket('ws://localhost:3000')
const socket = io("ws://localhost:3000");

const activity = document.querySelector(".activity");
const msgInput = document.querySelector("input");

function sendMessage(e) {
	e.preventDefault();
	if (msgInput.value) {
		socket.emit("message", msgInput.value);
		msgInput.value = "";
	}
	msgInput.focus();
}

//* Listen for messages
document.querySelector("form").addEventListener("click", sendMessage);

socket.on("message", (data) => {
	//$ Done to create an entry in the unordered list
	activity.textContent = "";
	const li = document.createElement("li");
	li.textContent = data;
	document.querySelector("ul").appendChild(li);
});

msgInput.addEventListener("keypress", () => {
	socket.emit("activity", socket.id.substring(0, 5));
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


//* Close the connection (WS)
// const endButton = document.querySelector('.end')

// endButton.addEventListener('click', ()=>{
//     socket.close()
// })

// socket.addEventListener('close', ()=>{
//     console.log('Connection closed')
// })
