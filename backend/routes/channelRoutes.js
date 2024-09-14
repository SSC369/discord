const router = require("express").Router();

const {
  fetchChannel,
  createChannel,
  deleteChannel,
  editChannel,
  fetchChannels,
} = require("../controllers/channelController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/channel", authMiddleware, createChannel);
router.get("/channels/:serverId", fetchChannels);
router.get("/channel/:id", fetchChannel);
router.delete("/channel/:id", deleteChannel);
router.put("/channel/:id", editChannel);

module.exports = router;
