const express = require("express");
const upload = require("../middlewares/upload.middleware");
const {
  convertWordToJsonController
} = require("../controllers/word.controller");

const router = express.Router();

router.post("/to-json", upload.single("file"), convertWordToJsonController);

module.exports = router;