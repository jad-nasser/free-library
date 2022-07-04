//importing modules
const booksDatabaseController = require("../database-controllers/books");
const fs = require("fs");
const multer = require("multer");

//publishers should be signed in in order to use these methods but the getBooks() can be used by
//all the users.
//No need to create the PDF files with 'fs' because Multer will do that, we only need to use 'fs' to
//delete the old PDF files in case the publisher wants to delete the book or updating the
//PDF file of the book.

//upload book middleware using Multer
exports.uploadBook = (req, res, next) => {
  //setting up Multer for uploading books PDF files
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, Date.now().toString() + file.originalname);
    },
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("The file should be PDF"), false);
  };
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 },
  }).single("book-file");

  //calling the upload function to upload the PDF file
  upload(req, res, (err) => {
    if (err) return res.status(500).json(err);
    next();
  });
};

//--------------------------------------------------------------------------------------------------

//create a book
exports.createBook = (req, res) => {
  //checking if the inputs are found and gathering them
  let info = { publisher_id: req.publisher.id };
  if (!req.body.book_name)
    return Promise.resolve(res.status(404).send("Book name not found"));
  info.book_name = req.body.book_name;
  if (!req.body.author)
    return Promise.resolve(res.status(404).send("Author name not found"));
  info.author = req.body.author;
  if (!req.file)
    return Promise.resolve(res.status(404).send("PDF file not found"));
  info.file_path = req.file.path;
  //adding the book to the database
  return booksDatabaseController
    .createBook(info)
    .then(() => res.status(200).send("Book successfully created"))
    .catch((err) => res.status(500).json(err));
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
    .then((data) => {
      return res.status(200).json({ books: data });
    })
    .catch((err) => res.status(500).json(err));
};

//-----------------------------------------------------------------------------

//update a book
//this can only be done by the publisher
exports.updateBook = (req, res) => {
  //gathering the update info
  let info = {};
  if (!req.body.id)
    return Promise.resolve(res.status(404).send("No book id is provided"));
  if (!req.body.updateInfo)
    return Promise.resolve(res.status(404).send("No update info are provided"));
  if (req.body.updateInfo.book_name)
    info.book_name = req.body.updateInfo.book_name;
  if (req.body.updateInfo.author) info.author = req.body.updateInfo.author;
  if (req.file) info.file_path = req.file.path;
  if (Object.keys(info).length === 0)
    return Promise.resolve(res.status(404).send("No update info are provided"));

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
          return res.status(404).send(err);
        return res.status(500).json(err);
      })
  );
};

//------------------------------------------------------------------------------------------

//download a book
exports.downloadBook = (req, res) => {
  let book = null;
  if (!req.query.id)
    return Promise.resolve(res.status(404).send("Book id not found"));
  return (
    //check if the book exists
    booksDatabaseController
      .getBooks({ id: req.query.id })
      .then((data) => {
        if (data.length === 0) return Promise.reject("Book not found");
        book = data[0];
      })
      //incrementing the number_of_downloads of that book
      .then(() => booksDatabaseController.incrementNumberOfDownloads(book.id))
      //downloading the book pdf file
      .then(() => {
        res.download(book.file_path);
      })
      .catch((err) => {
        if (err === "Book not found") return res.status(404).send(err);
        return res.status(500).json(err);
      })
  );
};

//-------------------------------------------------------------------------------------

//delete a book
exports.deleteBook = (req, res) => {
  if (!req.body.id)
    return Promise.resolve(res.status(404).send("No book id is provided"));
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
          return res.status(404).send(err);
        return res.status(500).json(err);
      })
  );
};
