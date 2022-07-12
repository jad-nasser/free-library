const mssql = require("mssql/msnodesqlv8");
const { getCurrentPool } = require("../connect-to-db");

//create a publisher user in the database
exports.createPublisher = (info) => {
  return getCurrentPool()
    .request()
    .input("first_name", info.first_name)
    .input("last_name", info.last_name)
    .input("email", info.email)
    .input("account_password", info.account_password)
    .query(
      "INSERT INTO Publishers (first_name,last_name,email,account_password)" +
        " " +
        "VALUES (@first_name,@last_name,@email,@account_password)"
    );
};

//get a publisher user from the database
exports.getPublisher = (email) => {
  return getCurrentPool()
    .request()
    .input("email", email)
    .query("SELECT * FROM Publishers WHERE email = @email")
    .then((response) => {
      let data = response.recordsets[0];
      return data;
    });
};

//update a publisher in the database
exports.updatePublisher = (id, updateInfo) => {
  let queryText = "UPDATE Publishers SET ";
  const request = new mssql.Request(getCurrentPool());
  request.input("id", id);
  //iterating through each property in the updateInfo object to create the query text code
  let objectKeys = Object.keys(updateInfo);
  for (let i = 0; i < objectKeys.length; i++) {
    let objectKey = objectKeys[i];
    request.input(objectKey, updateInfo[objectKey]);
    queryText = queryText + objectKey + " = @" + objectKey + " ";
    if (i !== objectKeys.length - 1) queryText = queryText + ",";
    queryText = queryText + " ";
  }
  queryText = queryText + "WHERE id = @id";
  return request.query(queryText);
};

//delete a publisher from the database
exports.deletePublisher = (id) => {
  return getCurrentPool()
    .request()
    .input("id", id)
    .query("DELETE FROM Publishers WHERE id = @id");
};

//delete all rows in the table
exports.clearTable = () => {
  return getCurrentPool().request().query("DELETE FROM Publishers");
};
