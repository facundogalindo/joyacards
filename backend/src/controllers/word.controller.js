const { convertWordToJson } = require("../services/wordToJson.service");

async function convertWordToJsonController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No se recibió ningún archivo"
      });
    }

    const questions = await convertWordToJson(req.file.buffer);

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
}

module.exports = {
  convertWordToJsonController
};