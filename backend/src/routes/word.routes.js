const express = require("express");
const multer = require("multer");
const { convertWordToJsonController } = require("../controllers/word.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post("/to-json", upload.single("file"), convertWordToJsonController);

module.exports = router;