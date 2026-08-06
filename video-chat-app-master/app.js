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

    // Create room if it doesn't exist
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    // Add current user
    rooms[roomId].push(socket.id);

    console.log("=================================");
    console.log("Room :", roomId);
    console.log("Users :", rooms[roomId]);
    console.log("=================================");

});

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
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