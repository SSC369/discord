const router = require("express").Router();

const {
  register,
  login,
  userProfile,
  fetchUsers,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, userProfile);
router.get("/users", fetchUsers);
module.exports = router;
