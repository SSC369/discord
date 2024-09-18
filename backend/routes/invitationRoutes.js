const router = require("express").Router();
const {
  addInvitation,
  cancelInvitation,
  acceptInvitation,
} = require("../controllers/invitationController");

router.post("/invite", addInvitation);
router.delete("/invite/:id", cancelInvitation);
router.get("/invite", acceptInvitation);

module.exports = router;
