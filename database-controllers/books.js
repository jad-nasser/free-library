const mssql = require("mssql/msnodesqlv8");

//create a book in the database
exports.createBook = (info) => {
  const request = new mssql.Request();
  request.input("book_name", info.book_name);
  request.input("author", info.author);
  request.input("file_path", info.file_path);
  request.input("publisher_id", info.publisher_id);
  return request.query(
    "INSERT INTO Books ( book_name, author, file_path, publisher_id ) " +
      "VALUES ( @book_name, @author, @file_path, @publisher_id )"
  );
};

//get books from the database
exports.getBooks = (info) => {
  const request = new mssql.Request();
  let queryText = "SELECT * FROM Books ";
  //iterating through every property in the info object to complete the query text
  let objectKeys = Object.keys(info);
  if (objectKeys.length !== 0) queryText = queryText + "WHERE ";
  for (let i = 0; i < objectKeys.length; i++) {
    let objectKey = objectKeys[i];
    request.input(objectKey, info[objectKey]);
    queryText = queryText + objectKey + " = @" + objectKey + " ";
    if (i !== objectKeys.length - 1) queryText = queryText + "AND ";
  }
  return request.query(queryText);
};

//update a book in the database
exports.updateBook = (id, updateInfo) => {
  const request = new mssql.Request();
  request.input("id", id);
  let queryText = "UPDATE Books SET ";
  //iterating through every property in the updateInfo object to complete the query text
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

//delete a book in the database
exports.deleteBook = (id) => {
  const request = new mssql.Request();
  request.input("id", id);
  return request.query("DELETE FROM Books WHERE id = @id");
};

//delete all books for a specific publisher in the database
exports.deleteAllPublisherBooks = (publisher_id) => {
  const request = new mssql.Request();
  request.input("publisher_id", publisher_id);
  return request.query("DELETE FROM Books WHERE publisher_id = @publisher_id");
};
