const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"});
const questionRouter = require("./src/routes/questionRoutes");
const userRouter = require("./src/routes/userRoutes")
const PORT = process.env.PORT || 3000;


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept"
  );
  next();
});


//DB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then((con) => {
    console.log("DB Connected Successfully!!");
  })
  .catch((err) => {
    console.log("Error Connecting to DB: ", err);
  });

 const corsOptions = {
   origin: "*",
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   allowedHeaders: "Content-Type,Authorization",
   optionsSuccessStatus: 200,
 };

app.use(express.json())
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use("/api/v1/question", questionRouter);
app.use("/api/v1/user", userRouter);
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
