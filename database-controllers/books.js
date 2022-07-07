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
  //getting sort information
  let sortColumn = "book_name";
  let sortWay = "ASC";
  if (info.sort_by) {
    if (info.sort_by === "alphabetical-order-reverse") {
      sortWay = "DESC";
    } else if (info.sort_by === "most-downloaded") {
      sortColumn = "number_of_downloads";
      sortWay = "DESC";
    }
  }
  //adding the search query to the query text according to the available info
  let thereIsFieldBefore = false;
  if (Object.keys(info).length > 0) queryText = queryText + "WHERE ";
  if (info.id) {
    request.input("id", info.id);
    queryText = queryText + "id = @id ";
    thereIsFieldBefore = true;
  }
  if (info.publisher_id) {
    request.input("publisher_id", info.publisher_id);
    if (thereIsFieldBefore)
      queryText = queryText + "AND publisher_id = @publisher_id ";
    else queryText = queryText + "publisher_id = @publisher_id ";
    thereIsFieldBefore = true;
  }
  if (info.book_name) {
    let book_name = "%" + info.book_name + "%";
    request.input("book_name", book_name);
    if (thereIsFieldBefore)
      queryText = queryText + "AND book_name LIKE @book_name ";
    else queryText = queryText + "book_name LIKE @book_name ";
    thereIsFieldBefore = true;
  }
  if (info.author) {
    let author = "%" + info.author + "%";
    request.input("author", author);
    if (thereIsFieldBefore) queryText = queryText + "AND author LIKE @author ";
    else queryText = queryText + "author LIKE @author ";
    thereIsFieldBefore = true;
  }
  //adding the sort part to the query text
  queryText = queryText + "ORDER BY " + sortColumn + " " + sortWay + " ";
  //returning the promise
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
