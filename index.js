const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

let onlineUsers = [];

io.on("connection", (socket) => {
	onlineUsers.push(socket.id);
	console.log(`${socket.id} joined.`);
	// Add to userList
	io.emit("connected", [socket.id, onlineUsers]);

	socket.on("disconnect", () => {
		// Remove from userList
		console.log("User disconnected.");
		onlineUsers = onlineUsers.filter((item) => item !== socket.id);
		io.emit("disconnected", socket.id);
	});

	socket.on("Chat message sent", (msg) => {
		io.emit("Chat message sent", [msg, socket.id]);
	});

	socket.on("typing", () => {
		io.emit("Show typing", socket.id);
	});
});

server.listen(3000, () => {
	console.log("listening on port 3000");
});
