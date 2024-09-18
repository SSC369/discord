const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/discordClone")
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => console.log(err));

// Socket.io connection

// Routes
const userRoutes = require("./routes/userRoutes");
const serverRoutes = require("./routes/serverRoutes");
const channelRoutes = require("./routes/channelRoutes");
const messageRoutes = require("./routes/messageRoutes");
const invitationRoutes = require("./routes/invitationRoutes");

app.use(userRoutes);
app.use(serverRoutes);
app.use(channelRoutes);
app.use(messageRoutes);
app.use(invitationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  socket.on("userOnline", ({ serverId, userId }) => {
    // Add user to the server's online list
    if (onlineUsers[serverId]) {
      onlineUsers[serverId].add(userId);
    } else {
      onlineUsers[serverId] = new Set();
      onlineUsers[serverId].add(userId);
    }
    socket.join(serverId);
    // Notify others in the server

    io.to(serverId).emit("onlineUsersCount", onlineUsers[serverId].size);
  });

  // User joins a channel
  socket.on("joinChannel", ({ channelId }) => {
    socket.join(channelId); // User joins a channel room
  });

  socket.on("leaveChannel", ({ channelId }) => {
    socket.leave(channelId);
  });

  // Handling sending messages to a channel
  socket.on("sendMessage", ({ channelId, message, userId, date, username }) => {
    io.to(channelId).emit("message", { userId, message, date, username }); // Send to specific room
  });

  socket.on("serverDisconnect", ({ serverId, userId }) => {
    // Remove user from the server's online list
    onlineUsers[serverId] = onlineUsers[serverId]?.filter(
      (id) => id !== userId
    );

    // Notify others in the server
    io.to(serverId).emit("userOffline", userId);
  });
});
