const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");

const connectMongo = require("./models");

const app = express();
connectMongo();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

app.use((err, req, res, next) => {
  let response;

  if (err.code) {
    response = err;
  } else {
    response = {
      code: 500,
      message: err.message
    };
  }

  res.json(response);
});

app.listen(app.get("port"), () => {
  console.log(`Server is created at http://localhost:${app.get("port")}`);
});
