const express = require("express");
const cors = require("cors");
const wordRoutes = require("./routes/word.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "Backend funcionando"
  });
});

app.use("/api/word", wordRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});