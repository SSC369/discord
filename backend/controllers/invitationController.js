const Invitation = require("../models/invitationModel");
const Server = require("../models/serverModel");

const addInvitation = async (req, res) => {
  try {
    const { receiverUserId, inviterUserId, serverId } = req.body;

    await Invitation.create({
      receiverUserId,
      inviterUserId,
      serverId,
    });

    res.status(201).json({ message: "Invitation sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    await Invitation.findByIdAndDelete(id);
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const { receiverUserId, serverId } = req.body;
    await Server.findByIdAndUpdate(serverId, {
      $push: {
        members: receiverUserId,
      },
    });

    res.status(200).json({ message: "Server Joined" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  acceptInvitation,
  cancelInvitation,
  addInvitation,
};
