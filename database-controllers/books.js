const mssql = require("mssql/msnodesqlv8");
const { getCurrentPool } = require("../connect-to-db");

//create a book in the database
exports.createBook = (info) => {
  const request = new mssql.Request(getCurrentPool());
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
  const request = new mssql.Request(getCurrentPool());
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
  return request.query(queryText).then((response) => {
    let data = response.recordsets[0];
    return data;
  });
};

//update a book in the database
exports.updateBook = (id, publisher_id, updateInfo) => {
  const request = new mssql.Request(getCurrentPool());
  request.input("id", id);
  request.input("publisher_id", publisher_id);
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
  queryText = queryText + "WHERE id = @id AND publisher_id = @publisher_id";
  return request.query(queryText);
};

//delete a book in the database
exports.deleteBook = (id, publisher_id) => {
  const request = new mssql.Request(getCurrentPool);
  request.input("id", id);
  request.input("publisher_id", publisher_id);
  return request.query(
    "DELETE FROM Books WHERE id = @id AND publisher_id = @publisher_id"
  );
};

//delete all books for a specific publisher in the database
exports.deleteAllPublisherBooks = (publisher_id) => {
  const request = new mssql.Request(getCurrentPool);
  request.input("publisher_id", publisher_id);
  return request.query("DELETE FROM Books WHERE publisher_id = @publisher_id");
};

//increment number_of_downloads of a book by one
exports.incrementNumberOfDownloads = (book_id) => {
  const request = new mssql.Request(getCurrentPool);
  request.input("id", book_id);
  return request.query(
    "UPDATE Books SET number_of_downloads = number_of_downloads + 1 WHERE id = @id"
  );
};

//delete all rows in the table
exports.clearTable = () => {
  return getCurrentPool().request().query("DELETE FROM Books");
};
