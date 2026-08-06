const express = require('express');
const app = express();

const server = require('http').createServer(app);
const cors = require('cors');


const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}); 

// Stores all active meeting rooms
const rooms = {};

app.use(cors());


app.get("/", (req, res) => {
    res.send('Hello from Server')
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

socket.on("join-room", (roomId) => {


   
        console.log("JOIN ROOM EVENT RECEIVED");
  
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    // Users already inside the room
    const existingUsers = [...rooms[roomId]];
console.log("Sending Existing Users:", existingUsers);
    // Send existing users only to the newly joined user
    socket.emit("existing-users", existingUsers);

    socket.join(roomId);

    // Now add current user
    rooms[roomId].push(socket.id);

    // Notify everyone already inside the room
    socket.to(roomId).emit("user-joined", {
    socketId: socket.id
    }); 


    console.log("=================================");
    console.log("Room :", roomId);
    console.log("Existing Users :", existingUsers);
    console.log("Current Users :", rooms[roomId]);
    console.log("=================================");

});

socket.on("send-offer", ({ target, caller, signal }) => {

    console.log("Offer received on server");
    console.log("From:", caller);
    console.log("To:", target);

    io.to(target).emit("receive-offer", {
        caller,
        signal
    });

});

  socket.on("disconnect", () => {

    // Remove disconnected socket from every room
    for (const roomId in rooms) {

        rooms[roomId] = rooms[roomId].filter(
            (id) => id !== socket.id
        );

        // Remove room if it becomes empty
        if (rooms[roomId].length === 0) {
            delete rooms[roomId];
        }
    }

    socket.broadcast.emit("callEnded");

    console.log("User Disconnected:", socket.id);
    console.log("Rooms:", rooms);
});
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
});
let PORT = 5000;

//if (process.env.PORT) {
  //  PORT = process.env.PORT    
//}


server.listen(PORT , ()=>{
    console.log("server is live at http://localhost:5000")
});