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

//allows all the users of the website to show books
router.get("/get-books", booksController.getBooks);

//allows the publisher to update a book
router.patch(
  "/update-book",
  publishersController.readCookie,
  booksController.uploadBook,
  booksController.updateBook
);

//allows the publisher to delete a book
router.delete(
  "/delete-book",
  publishersController.readCookie,
  booksController.deleteBook
);

module.exports = router;
