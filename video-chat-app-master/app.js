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


app.use(cors());


app.get("/", (req, res) => {
    res.send('Hello from Server')
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

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