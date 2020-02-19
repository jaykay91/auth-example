const express = require("express");
const morgan = require("morgan");
const path = require("path");
const createError = require("http-errors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const flash = require("connect-flash");

dotenv.config();

const connectMongo = require("./schemas");
const configPassport = require("./passport");

const indexRouter = require("./routes");
const authRouter = require("./routes/auth");

const app = express();
connectMongo();
configPassport(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOpts = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false
  },
  store: new RedisStore({
    host: "localhost",
    port: 1234,
    logErrors: true
  })
};

app.use(session(sessionOpts));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use("/", indexRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.json(err);
});

app.listen(app.get("port"), () => {
  console.log(`Server is created at http://localhost:${app.get("port")}`);
});
