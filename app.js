//importing modules
const express = require("express");
const path = require("path");
//initialise the app
const app = express();
//adding middlewares
app.use(express.json());
//set static folders
app.use(express.static(path.join(__dirname, "public")));
//catch all the requests that dont match any route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
