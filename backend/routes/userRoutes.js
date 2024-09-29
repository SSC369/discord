const router = require("express").Router();

const {
  register,
  login,
  userProfile,
  fetchInviteUsers,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, userProfile);
router.get("/invite/users/:serverId", fetchInviteUsers);
module.exports = router;
