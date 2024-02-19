import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()

const io = new Server(httpServer, {
	cors: {
		origin:
			process.env.NODE_ENV === "production"
				? false
				: ["http://localhost:5500", "http://127.0.0.1:5500"],
	},
});

// * ws cannot deal with the request and response cycle of the HTTP protocol
// * It is a low-level protocol that allows us to send and receive messages
// * It does not broadcast messages to all connected clients
io.on('connection', socket=>{
    console.log('New connection')
    console.log(`User: ${socket.id} connected`)

    socket.on("message", (data) => {
        console.log(data);
        io.emit('message', `${socket.id.substring(0, 5)}:  ${data}`)
    })
})

httpServer.listen(3000, ()=>{
    console.log('Listening on port 3000')
})
