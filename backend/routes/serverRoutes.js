const router = require("express").Router();
const {
  createServer,
  fetchServers,
  fetchServer,
  createInviteCode,
  deleteServer,
} = require("../controllers/serverController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/server", authMiddleware, createServer);
router.get("/server", authMiddleware, fetchServers);
router.get("/server/:id", fetchServer);
router.put("/server/invite/:id", createInviteCode);
router.delete("/server/:id", deleteServer);
module.exports = router;
