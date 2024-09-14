const router = require("express").Router();
const {
  createServer,
  fetchServers,
  fetchServer,
} = require("../controllers/serverController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/server", authMiddleware, createServer);
router.get("/server", authMiddleware, fetchServers);
router.get("/server/:id", fetchServer);

module.exports = router;
