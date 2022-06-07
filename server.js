const app = require("./app");
require("dotenv").config();
const connectToDB = require("./connect-to-db");
//connecting to the database
connectToDB("free-library");
//start the server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
