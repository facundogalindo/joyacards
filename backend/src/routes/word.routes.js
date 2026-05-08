const express = require("express");
const multer = require("multer");
const { convertWordToJson } = require("../services/wordToJson.service");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post("/to-json", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No se recibió ningún archivo"
      });
    }

    const shouldShuffle = req.query.shuffle !== "false";

    const questions = await convertWordToJson(req.file.buffer, {
      shuffle: shouldShuffle
    });

    return res.json({
      total: questions.length,
      questions
    });
  } catch (error) {
    console.error("Error al convertir Word a JSON:", error);

    return res.status(500).json({
      message: error.message || "Error al convertir Word a JSON"
    });
  }
});

module.exports = router;