const mssql = require("mssql/msnodesqlv8");

//create a publisher user in the database
exports.createPublisher = (info) => {
  const request = new mssql.Request();
  request.input("first_name", info.first_name);
  request.input("last_name", info.last_name);
  request.input("email", info.email);
  request.input("account_password", info.account_password);
  return request.query(
    "INSERT INTO Publishers (first_name,last_name,email,account_password)" +
      " " +
      "VALUES (@first_name,@last_name,@email,@account_password)"
  );
};

//get a publisher user from the database
exports.getPublisher = (email) => {
  const request = new mssql.Request();
  request.input("emal", email);
  return request
    .query("SELECT * FROM Publishers WHERE email = @email")
    .then((response) => {
      let data = response.recordsets[0];
      return data;
    });
};

//update a publisher in the database
exports.updatePublisher = (id, updateInfo) => {
  let queryText = "UPDATE Publishers SET ";
  const request = new mssql.Request();
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
  const request = new mssql.Request();
  request.input("id", id);
  return request.query("DELETE FROM Publishers WHERE id = @id");
};

//delete all rows in the table
exports.clearTable = () => {
  const request = new mssql.Request();
  return request.query("DELETE FROM Publishers");
};
