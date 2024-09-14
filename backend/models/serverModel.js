const mongoose = require("mongoose");

const ServerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: { type: String, default: "member" }, // or can be mod, owner
      ban: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Server", ServerSchema);
