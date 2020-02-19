const express = require("express");
const morgan = require("morgan");
const path = require("path");
const createError = require("http-errors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

dotenv.config();

const connect = require("./schemas");
const passportConfig = require("./passport");
const indexRouter = require("./routes");
const sessionBasedRouter = require("./routes/session-based-auth");

const app = express();
connect();
passportConfig(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
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
app.use(passport.initialize());
app.use(passport.session());

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
