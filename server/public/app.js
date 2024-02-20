// const socket = new WebSocket('ws://localhost:3000')
const socket = io("ws://localhost:3000");

function sendMessage(e) {
	e.preventDefault();
	const input = document.querySelector("input");
	if (input.value) {
		socket.emit("message", input.value);
		input.value = "";
	}
	input.focus();
}

//* Listen for messages
document.querySelector("form").addEventListener("click", sendMessage);
socket.on("message", (data) => {
	//$ Done to create an entry sin the unordered list
	const li = document.createElement("li");
	li.textContent = data;
	document.querySelector("ul").appendChild(li);
});

//* Close the connection
// const endButton = document.querySelector('.end')

// endButton.addEventListener('click', ()=>{
//     socket.close()
// })

// socket.addEventListener('close', ()=>{
//     console.log('Connection closed')
// })
