require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");

const connectionInfo = [];
app.use(express.json());
app.use(cors());

// servers starts listening
const server = app.listen(4000, () => {
  console.log("Server started at 4000");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket id:", socket.id);

  socket.on("joinRoom", (roomName) => {
    // Leave any previous room before joining the new one
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }

    // Join the new room
    socket.join(roomName);
    socket.currentRoom = roomName;
    console.log(`Socket ${socket.id} joined room ${roomName}`);
  });

  socket.on("canvas", (data) => {
    console.log("data received");
    // Emit the data only to the users in the same room
    if (socket.currentRoom) {
      io.to(socket.currentRoom).emit("canvas", data);
    }
  });

  socket.on("disconnect", () => {
    // Make sure to leave the room when the user disconnects
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }
  });
});
