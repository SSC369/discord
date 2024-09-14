const Server = require("../models/serverModel");

const createServer = async (req, res) => {
  try {
    const { name, image } = req.body;
    const { userId } = req.user;

    //check if server name is already exist
    const server = await Server.findOne({ name });
    if (server)
      return res.status(400).json({ message: "Name already in use!" });

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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchServers = async (req, res) => {
  try {
    const { userId } = req.user;
    const servers = await Server.find({ owner: userId });

    return res.status(200).json({ servers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createServer, fetchServers, fetchServer };
