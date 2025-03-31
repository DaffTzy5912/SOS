const express = require("express"); const http = require("http"); const { Server } = require("socket.io"); const cors = require("cors");

const app = express(); const server = http.createServer(app); const io = new Server(server, { cors: { origin: "https://sos-sepia.vercel.app", methods: ["GET", "POST"] } });

app.use(cors({ origin: "https://sos-sepia.vercel.app" }));

let rooms = {}; // Menyimpan state permainan per room

io.on("connection", (socket) => { console.log("User connected", socket.id);

socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);
    
    if (!rooms[roomCode]) {
        rooms[roomCode] = { board: Array(9).fill(""), players: [] };
    }
    
    if (rooms[roomCode].players.length < 2) {
        rooms[roomCode].players.push(socket.id);
    }
    
    io.to(roomCode).emit("updateBoard", rooms[roomCode]);
});

socket.on("makeMove", ({ roomCode, index, symbol }) => {
    if (rooms[roomCode] && rooms[roomCode].board[index] === "") {
        rooms[roomCode].board[index] = symbol;
        io.to(roomCode).emit("updateBoard", rooms[roomCode]);
    }
});

socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    for (let room in rooms) {
        rooms[room].players = rooms[room].players.filter(id => id !== socket.id);
        if (rooms[room].players.length === 0) delete rooms[room];
    }
});

});

const PORT = process.env.PORT || 3000; server.listen(PORT, () => { console.log(Server running on port ${PORT}); });

