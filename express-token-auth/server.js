const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const indexRouter = require("./routes");
const apiRouter = require("./routes/api");

const app = express();
// connectMongo()

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
  next({
    code: 404,
    message: "Not Found"
  });
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
