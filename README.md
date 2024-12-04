# Chat App using websockets and Socket.IO

The web app consists of backend on Node.js, Socket.IO, websocket (previously) and the frontend on HTML, CSS, JS

## Summary

- The chat app web project involves chat based communication between users that can join any room that they desire.
- The frontend was made with HTML, CSS, JS while the backend was made in Node.js, Express.js, and Socket.IO.
- The app was made as I always wanted to explore how chat applications communicae with the user and how each user can send messages across.
- The project was deployed on render deployment service which helped me understand deployment process better.

## How to run

```
cd server
npm install
npm run dev
```

## Backend

socket.on or io.on involves dealing with listeners

[Functions]

- activate user: User has id, name and room_name. if the user name is not in the users array (via the setUsers) then add the user.

[Endpoints]

- /connected: Used by the socket.io server instance to establish / start the events under the connection. Used by the io.on listener.

- /message: deals with the message event, and is used throughout to send messages using the buildmsg function.

- /enterRoom: Manages the user joining a room, removing them from the previous room.
  - prevRoom will get the user via id, if exists then emit left msg.
  - activate the user, for the new room, add to it, emit messages.
  - emit userslist, roomslist.

- /disconnect: gets the user removes them from the room, emits msgs and the userslist

- /activity: checks whether any user is in the room or not and whether some activity is performed or not, if so, emit said activity

## Frontend

- form uses 2 text inputs, join button, chat display via unordered list, users and rooms lists, typing activity, msgInput and send button

- The page takes messageInput, nameInput, chatRoomInput, activity-handler, roomsList, usersList in the current room.

- Functions for entering a room [check the name of user and the room name and then emit the message to the "enterRoom" endpoint]
  and sending a message [checks for msgInput, nameInput, chatRoom input, if true, emit a msg to the users in the room via '/enterRoom' endpoint, while sending the name and text to server.]

- message event: clears the text innput upon sending the message, adds to the list item the name, text and time of message.
  add the messages in the chat display. ADMIN message at top.

- activity event: show the user typing and clear timeout at 800ms (clear the activity area after that)

[Functions]

- showUsers: if there are any users connected to the service, show users in room.

- showRooms: if there are any rooms in use by the users, show rooms a the moment.

.....

To use it, go to: [https://websocketchatapp-wpj0.onrender.com]
