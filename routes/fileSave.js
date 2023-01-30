const { saveFile,compressFile } = require("../controllers/fileSave");
const router = require("express").Router();

router.post("/saveFile", saveFile);
router.post("/compressFile", compressFile);


module.exports = router;
