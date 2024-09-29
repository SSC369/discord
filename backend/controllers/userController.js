const User = require("../models/userModel");
const Server = require("../models/serverModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    //check that is there a same username exits
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({ message: "Username already used" });
    }

    //check that is there a same email exists
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({
        message: "Email is already registered!",
        status: false,
      });
    }

    //create hashed pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const user = await User.findOne({ email });
    const secretKey = "SSC";
    const payload = {
      username: user.username,
      email,
      userId: user._id,
    };
    const jwtToken = jwt.sign(payload, secretKey);

    return res.status(201).json({ jwtToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //authentication for user
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "Email is not registered!", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Incorrect Password :(" });

    const secretKey = "SSC";
    const payload = {
      username: user.username,
      email,
      userId: user._id,
    };
    const jwtToken = jwt.sign(payload, secretKey);

    return res.status(200).json({ jwtToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const { username, password, profileImage } = req.body;
    const { email } = req.user;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.updateOne(
      { email },
      {
        $set: {
          username,
          password: hashedPassword,
          profileImage,
        },
      }
    );
    const user = await User.findOne({ email });
    const secretKey = "SSC";
    const payload = {
      username,
      email,
      userId: user._id,
    };
    const jwtToken = await jwt.sign(payload, secretKey);

    res.status(200).json({ message: "Profile updated successfully", jwtToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//fetch users by username

const fetchInviteUsers = async (req, res) => {
  try {
    const { name } = req.query;
    const { serverId } = req.params;

    // Fetch all users and the server concurrently
    const [users, server] = await Promise.all([
      User.find(),
      Server.findById(serverId),
    ]);

    // Filter users by name if the name is provided
    let filteredUsers = users;
    if (name) {
      filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Map the users to include the 'invite' status
    const result = filteredUsers.map((u) => {
      const isMember = server.members.some((m) => m.userId.equals(u._id));

      return { ...u._doc, invite: !isMember };
    });

    // Send the response with the result array
    return res.status(200).json({ users: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  editProfile,
  userProfile,
  fetchInviteUsers,
};
