const router = require("express").Router();

const {
  register,
  login,
  userProfile,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, userProfile);
module.exports = router;
