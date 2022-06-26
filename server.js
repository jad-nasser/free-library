const app = require("./app");
require("dotenv").config();
const { connect } = require("./connect-to-db");
//connecting to the database
connect("free-library").catch((err) => console.log(err));
//start the server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
