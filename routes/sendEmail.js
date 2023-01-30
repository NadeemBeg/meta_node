const { sendEmail,otpVerify } = require("../controllers/sendEmail");
const router = require("express").Router();

router.post("/sendEmail/", sendEmail);
router.post("/otpVerify/", otpVerify);

module.exports = router;