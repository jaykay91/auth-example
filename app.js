const express = require("express");
const morgan = require("morgan");
const path = require("path");
const createError = require("http-errors");
const dotenv = require("dotenv");

dotenv.config();

const connect = require("./schemas");
const indexRouter = require("./routes");
const sessionBasedRouter = require("./routes/session-based-auth");

const app = express();
connect();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/session-based-auth", sessionBasedRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.json(err);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is created at http://localhost:${PORT}`);
});
