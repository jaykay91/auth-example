const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

dotenv.config();

const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");

const connectMongo = require("./models");

const app = express();
connectMongo();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);
app.use(flash());

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
