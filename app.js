const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"});
const questionRouter = require("./src/routes/questionRoutes");
const PORT = process.env.PORT || 3000;

//DB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then((con) => {
    console.log("DB Connected Successfully!!");
  })
  .catch((err) => {
    console.log("Error Connecting to DB: ", err);
  });

app.use(express.json())
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/question", questionRouter);
console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(`Quiz app running on port ${PORT}`);
});

app.all("*", (err, req, res, next) => {
  res.status(500).json({
    status: "failed",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});
