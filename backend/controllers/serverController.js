const Server = require("../models/serverModel");
const Channel = require("../models/channelModel");
const Message = require("../models/messageModel");
const mongoose = require("mongoose");

const createServer = async (req, res) => {
  try {
    const { name, image } = req.body;
    const { userId } = req.user;

    //check if server name is already exist
    // const server = await Server.findOne({ name });
    // if (server)
    //   return res.status(400).json({ message: "Name already in use!" });

    await Server.create({
      name,
      image,
      owner: userId,
      members: [
        {
          userId,
          role: "owner",
        },
      ],
    });
    return res.status(201).json({ message: "Server created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchServer = async (req, res) => {
  try {
    const { id } = req.params;

    const server = await Server.findById(id);
    return res.status(200).json({ server });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateServer = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteServer = async (req, res) => {
  try {
    const { id } = req.params;
    await Server.findByIdAndDelete(id);
    res.status(200).json({ message: "Server deleted" });
    const channels = await Channel.find({ serverId: id });
    const messagePromises = channels.map((c) => {
      const { _id } = c;
      return Message.deleteMany({ channelId: _id });
    });

    const channelPromises = channels.map((c) => {
      const { _id } = c;
      return Channel.findByIdAndDelete(_id);
    });

    await Promise.all(messagePromises);
    await Promise.all(channelPromises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchServers = async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch servers where the user might be a member
    const servers = await Server.find();

    // Filter servers to get only those where the user is a member
    const userServers = servers.filter((s) => {
      return s.members.some((m) => m.userId.toString() === userId.toString());
    });

    return res.status(200).json({ servers: userServers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const { id } = req.params;

    await Server.findByIdAndUpdate(id, {
      $set: {
        inviteCode,
      },
    });
    res.status(200).json({ message: "Invite code saved!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createServer,
  fetchServers,
  fetchServer,
  createInviteCode,
  deleteServer,
};
