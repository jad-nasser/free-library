//importing modules
const booksDatabaseController = require("../database-controllers/books");
const fs = require("fs");

//publishers should be signed in in order to use these methods but the getBooks() can be used by
//all the users
//No need to create the PDF files in the controller because Multer will do that, we only need to delete the
//old PDF files in case the publisher wants to delete the book or updating the PDF file of the book.

//create a book
exports.createBook = (req, res) => {
  //checking if the inputs are found and gathering them
  let info = { publisher_id: req.publisher.id };
  if (!req.body.book_name)
    return Promise.reject(res.status(404).send("Book name not found"));
  info.book_name = req.body.book_name;
  if (!req.body.author)
    return Promise.reject(res.status(404).send("Author name not found"));
  info.author = req.body.author;
  if (!req.body.file_path)
    return Promise.reject(res.status(404).send("PDF file not found"));
  info.file_path = req.body.file_path;
  //adding the book to the database
  return booksDatabaseController
    .createBook(info)
    .then(() => res.status(200).send("Book successfully created"))
    .catch((err) => Promise.reject(res.status(500).json(err)));
};

//-------------------------------------------------------------------------------

//get books
exports.getBooks = (req, res) => {
  //gathering search info
  let info = {};
  if (req.publisher && req.publisher.id) info.publisher_id = req.publisher.id;
  if (req.query.book_name) info.book_name = req.query.book_name;
  if (req.query.author) info.author = req.query.author;
  //searching the books in the database and returning them
  return booksDatabaseController
    .getBooks(info)
    .catch((err) => Promise.reject(res.status(500).json(err)));
};

//-----------------------------------------------------------------------------

//update a book
exports.updateBook = (req, res) => {
  //gathering the update info
  let info = {};
  if (!req.body.id)
    return Promise.reject(res.status(404).send("No book id is provided"));
  if (!req.body.updateInfo)
    return Promise.reject(res.status(404).send("No update info are provided"));
  if (req.body.updateInfo.book_name)
    info.book_name = req.body.updateInfo.book_name;
  if (req.body.updateInfo.author) info.author = req.body.updateInfo.author;
  if (req.body.updateInfo.file_path)
    info.file_path = req.body.updateInfo.file_path;
  if (Object.keys(info).length === 0)
    return Promise.reject(res.status(404).send("No update info are provided"));

  //returning book update promise
  return (
    new Promise((resolve, reject) => {
      //getting the book from the database in case the publisher wants to update the PDF file
      if (info.file_path)
        resolve(booksDatabaseController.getBooks({ id: req.body.id }));
      resolve("The publisher do not want to update the book PDF");
    })
      //deleting the old PDF file if the publisher wants to update the PDF file of the book
      .then((data) => {
        if (data === "The publisher do not want to update the book PDF")
          return true;
        if (data.length === 0) return Promise.reject("This book is not exist");
        if (data[0].publisher_id !== req.publisher.id)
          return Promise.reject("This is not your book");
        let old_file_path = data[0].file_path;
        return new Promise((resolve, reject) => {
          fs.unlink(old_file_path, (err) => {
            if (err) reject(err);
            else resolve(true);
          });
        });
      })
      //updating the book in the database
      .then(() =>
        booksDatabaseController.updateBook(req.body.id, req.publisher.id, info)
      )
      .then(() => res.status(200).send("The book is successfully updated"))
      .catch((err) => {
        if (err === "This book is not exist" || err === "This is not your book")
          return Promise.reject(res.status(404).send(err));
        return Promise.reject(res.status(500).json(err));
      })
  );
};

//------------------------------------------------------------------------------------------

//delete a book
exports.deleteBook = (req, res) => {
  if (!req.body.id)
    return Promise.reject(res.status(404).send("No book id is provided"));
  return (
    //getting the book from the database
    booksDatabaseController
      .getBooks({ id: req.body.id })
      //delete the PDF file from the server
      .then((data) => {
        if (data.length === 0) return Promise.reject("This book is not exist");
        if (data[0].publisher_id !== req.publisher.id)
          return Promise.reject("This is not your book");
        let old_file_path = data[0].file_path;
        return new Promise((resolve, reject) => {
          fs.unlink(old_file_path, (err) => {
            if (err) reject(err);
            else resolve(true);
          });
        });
      })
      //deleting the book from the database
      .then(() =>
        booksDatabaseController.deleteBook(req.body.id, req.publisher.id)
      )
      .then(() => res.status(200).send("The book is successfully deleted"))
      .catch((err) => {
        if (err === "This book is not exist" || err === "This is not your book")
          return Promise.reject(res.status(404).send(err));
        return Promise.reject(res.status(500).json(err));
      })
  );
};
