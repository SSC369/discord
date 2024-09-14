const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Server",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
  },
});

module.exports = mongoose.model("Channel", channelSchema);
