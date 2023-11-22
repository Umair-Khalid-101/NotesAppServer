const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const transcribeRoutes = require("./routes/transcribeRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("GET REQ at EndPoint: `/`");
  res.json("API IS RUNNING");
});

app.use("/api/transcribe", transcribeRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`server started on port: ${PORT}`));
