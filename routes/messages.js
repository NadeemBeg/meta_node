const { addMessage, getMessages, getFirebaseMsg } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.get('/getFirebaseMsg',getFirebaseMsg)

module.exports = router;
