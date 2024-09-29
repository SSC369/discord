const router = require("express").Router();
const {
  addInvitation,
  cancelInvitation,
  acceptInvitation,
  fetchInvitations,
} = require("../controllers/invitationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/invite", addInvitation);
router.delete("/invite/:id", cancelInvitation);
router.put("/invite/:id", acceptInvitation);
router.get("/invite", authMiddleware, fetchInvitations);

module.exports = router;
