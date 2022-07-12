//importing modules
const express = require("express");
const publishersController = require("../controllers/publishers");
const booksController = require("../controllers/books");

//creating the router
const router = express.Router();

//allows the publisher to add a book
router.post(
  "/create-book",
  publishersController.readCookie,
  booksController.uploadBook,
  booksController.createBook
);

//returns books to the users
router.get("/get-books", booksController.getBooks);

//returns publisher's books
router.get(
  "/get-publisher-books",
  publishersController.readCookie,
  booksController.getBooks
);

//allows the publisher to update a book
router.patch(
  "/update-book",
  publishersController.readCookie,
  booksController.uploadBook,
  booksController.updateBook
);

//download a book
router.get("/download-book", booksController.downloadBook);

//allows the publisher to delete a book
router.delete(
  "/delete-book",
  publishersController.readCookie,
  booksController.deleteBook
);

module.exports = router;
