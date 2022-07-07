//importing modules
const express = require("express");
const path = require("path");
const publishersRouter = require("./routers/publishers");
const booksRouter = require("./routers/books");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//initialise the app
const app = express();
//adding middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
//set routers
app.use("/publishers", publishersRouter);
app.use("/books", booksRouter);
//set static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//catch all the requests that dont match any route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
