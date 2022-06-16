//importing modules
const booksController = require("../../controllers/books");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { expect } = require("chai");

//test data
const book = {
  book_name: "test",
  author: "test",
  file_path: "test.pdf",
};

//creating mock request and response objects
const request = {
  body: {},
  publisher: { id: "1", email: "testtest@email.com" },
};
const response = {
  statusCode: 200,
  json: function (data) {
    this.data = data;
    return this;
  },
  send: function (data) {
    this.data = data;
    return this;
  },
  cookie: function () {
    return this;
  },
  status: function (statusNumber) {
    this.statusCode = statusNumber;
    return this;
  },
};

describe("testing books controller", function () {
  //create a book
  describe("testing createBook()", function () {
    //testing when sending empty request
    it('Should send 404 response with a message "Book name not found"', function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      let res = Object.assign({}, response);
      //calling the function
      booksController
        .createBook(req, res)
        //assertions
        .then(function () {
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Book name not found");
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    //testing when every thing is done correctly
    it('Should send 200 response with a message "Book successfully created"', function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body = book;
      let res = Object.assign({}, response);
      //mocking the database controller method createBook()
      let createBookStub = sinon.stub().returns(Promise.resolve(true));
      let controller = proxyquire("../../controllers/books", {
        "../database-controllers/books": { createBook: createBookStub },
      });
      //calling the function
      controller
        .createBook(req, res)
        //assertions
        .then(function () {
          expect(res.statusCode).to.be.equal(200);
          expect(res.data).to.be.equal("Book successfully created");
          expect(createBookStub.calledOnce).to.be.true;
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  //get books
  describe("testing getBooks()", function () {
    //testing getBooks()
    it("Should send 200 response with the book", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.book_name = book.book_name;
      let res = Object.assign({}, response);
      //mocking the database controller method getBooks()
      let getBooksStub = sinon
        .stub()
        .returns(Promise.resolve({ books: [book] }));
      let controller = proxyquire("../../controllers/books", {
        "../database-controllers/books": { getBooks: getBooksStub },
      });
      //calling the function
      controller
        .getBooks(req, res)
        //assertions
        .then(function () {
          expect(res.statusCode).to.be.equal(200);
          expect(res.data.books.length).to.be.equal(1);
          expect(getBooksStub.calledOnce).to.be.true;
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  //update a book
  describe("testing updateBook()", function () {
    //testing updateBook when the book id is not provided in the request
    it("Should send 404 response with a message 'No book id is provided'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      let res = Object.assign({}, response);
      //calling the function
      booksController
        .updateBook(req, res)
        //assertions
        .then(function () {
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("No book id is provided");
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
    //testing updateBook() when no update info is provided in the request
    it("Should send 404 response with a message 'No update info are provided'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.id = "1";
      let res = Object.assign({}, response);
      //calling the function
      booksController
        .updateBook(req, res)
        //assertions
        .then(function () {
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("No update info are provided");
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
    //testing updateBook() when everything is done correctly
    it("Should send 200 response with a message 'The book is successfully updated'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.id = "1";
      req.body.updateInfo = { book_name: "test2" };
      let res = Object.assign({}, response);
      //mocking the database controller method updateBook()
      let updateBookStub = sinon.stub().returns(Promise.resolve(true));
      let controller = proxyquire("../../controllers/books", {
        "../database-controllers/books": { updateBook: updateBookStub },
      });
      //calling the function
      controller
        .updateBook(req, res)
        //assertions
        .then(function () {
          expect(res.statusCode).to.be.equal(200);
          expect(res.data).to.be.equal("The book is successfully updated");
          expect(updateBookStub.calledOnce).to.be.true;
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  //delete a book
  describe("testing deleteBook()", function () {
    //testing deleteBook() when no book id is provided in the request
    it("Should send 404 response with a message 'No book id is provided'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      let res = Object.assign({}, response);
      //calling the function
      booksController
        .deleteBook(req, res)
        //assertions
        .then(function () {
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("No book id is provided");
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    //testing deleteBook() when everything is done correctly
    it("Should send 200 response with a message 'The book is successfully deleted'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.id = "1";
      let res = Object.assign({}, response);
      //mocking the database controller method deleteBook()
      let deleteBookStub = sinon.stub().returns(Promise.resolve(true));
      let controller = proxyquire("../../controllers/books", {
        "../database-controllers/books": { deleteBook: deleteBookStub },
      });
      //calling the function
      controller
        .deleteBook(req, res)
        //assertions
        .then(function () {
          expect(res.statusCode).to.be.equal(200);
          expect(res.data).to.be.equal("The book is successfully deleted");
          expect(deleteBookStub.calledOnce).to.be.true;
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });
});
