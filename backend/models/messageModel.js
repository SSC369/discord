const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Channel",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: { type: Date, required: true },
  username: { type: String, required: true },
});

module.exports = mongoose.model("Message", MessageSchema);
