const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  AddMessage,
  fetchMessages,
  deleteMessage,
  editMessage,
} = require("../controllers/messageController");

router.post("/message", authMiddleware, AddMessage);
router.get("/messages/:channelId", fetchMessages);
router.delete("/message/:id", deleteMessage);
router.put("/message/:id", editMessage);
module.exports = router;
