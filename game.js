const socket = io("https://sos-sepia.vercel.app");
let roomCode = localStorage.getItem("roomCode");
let symbol = "S";
let isMyTurn = false;

if (roomCode) {
    socket.emit("joinRoom", roomCode);
}

document.getElementById("roomCodeDisplay").textContent = `Room Code: ${roomCode}`;

document.getElementById("selectS").addEventListener("click", () => symbol = "S");
document.getElementById("selectO").addEventListener("click", () => symbol = "O");

socket.on("updateBoard", (data) => {
    document.getElementById("board").innerHTML = "";
    data.board.forEach((cell, index) => {
        let div = document.createElement("div");
        div.classList.add("cell");
        div.textContent = cell;
        div.onclick = () => makeMove(index);
        document.getElementById("board").appendChild(div);
    });
    
    if (data.players.length === 2) {
        document.getElementById("turn").textContent = "Game dimulai! Pilih S atau O.";
        isMyTurn = data.players[0] === socket.id;
    }
});

function makeMove(index) {
    if (isMyTurn) {
        socket.emit("makeMove", { roomCode, index, symbol });
        isMyTurn = false;
    }
}
