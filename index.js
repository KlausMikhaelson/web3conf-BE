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

  socket.on("canvas", (data) => {
    console.log("data received")
    socket.broadcast.emit("canvas", data);
  });
});
