const socket = io("https://sos-sepia.vercel.app");

function createRoom() { let roomCode = Math.random().toString(36).substring(2, 7).toUpperCase(); localStorage.setItem("roomCode", roomCode); document.getElementById("roomCodeDisplay").textContent = Kode Room: ${roomCode}; socket.emit("joinRoom", roomCode); window.location.href = "game.html"; }

function joinRoom(roomCode) { if (roomCode) { localStorage.setItem("roomCode", roomCode); socket.emit("joinRoom", roomCode); window.location.href = "game.html"; } else { alert("Masukkan kode room yang valid!"); } }

