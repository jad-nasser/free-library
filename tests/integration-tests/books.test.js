//importing modules
const app = require("../../app");
const { connect } = require("../../connect-to-db");
const publishersDBController = require("../../database-controllers/publishers");
const booksDBController = require("../../database-controllers/books");
const request = require("supertest");
const { expect } = require("chai");
const bcrypt = require("bcrypt");
require("dotenv").config();

//test data
let publisher = {
  first_name: "test",
  last_name: "test",
  email: "testtest@email.com",
};
let publisher_password = "Q1!asdfg";
let book = {
  book_name: "test",
  author: "test",
  file_path: "test.pdf",
};
let book2 = {
  book_name: "test2",
  author: "test2",
  file_path: "test2.pdf",
};

let connection = null;

before(function (done) {
  bcrypt
    .hash(publisher_password, 10)
    .then(function (hashedPassword) {
      publisher.account_password = hashedPassword;
    })
    .then(function () {
      return connect("free-library-test");
    })
    .then(function (pool) {
      connection = pool;
      done();
    })
    .catch(function (err) {
      done(err);
    });
});
after(function (done) {
  connection
    .close()
    .then(function () {
      done();
    })
    .catch(function (err) {
      done(err);
    });
});
beforeEach(function (done) {
  booksDBController
    .clearTable()
    .then(function () {
      return publishersDBController.clearTable();
    })
    .then(function () {
      done();
    })
    .catch(function (err) {
      console.log(err);
      done(err);
    });
});

describe("Testing all books routes", function () {
  //testing create book
  it("testing /books/create-book it should successfully create a book", function (done) {
    this.timeout(10000);
    //adding a publisher to the database
    publishersDBController
      .createPublisher(publisher)
      //sign in
      .then(function () {
        return request(app)
          .post("/publishers/login")
          .send({
            email: publisher.email,
            account_password: publisher_password,
          })
          .expect(200);
      })
      //getting the token
      .then((response) => {
        response.text = JSON.parse(response.text);
        return response;
      })
      //sending create book request
      .then(function (response) {
        let token = response.text.token;
        return request(app)
          .post("/books/create-book")
          .set("Cookie", ["token=" + token])
          .field("book_name", book.book_name)
          .field("author", book.author)
          .attach("book-file", "./tests/test-files/test1.pdf")
          .expect(200);
      })
      .then(function () {
        done();
      })
      .catch(function (err) {
        console.log(err);
        done(err);
      });
  });

  //testing get book info
  it("testing /books/get-books it should successfully return a book", function (done) {
    //adding a publisher to the database
    publishersDBController
      .createPublisher(publisher)
      //getting the created publisher id
      .then(function () {
        return publishersDBController.getPublisher(publisher.email);
      })
      //adding books to the database
      .then(function (data) {
        let publisher_id = data[0].id;
        book.publisher_id = publisher_id;
        book2.publisher_id = publisher_id;
        return booksDBController.createBook(book);
      })
      .then(function () {
        return booksDBController.createBook(book2);
      })
      //sending get book request
      .then(function () {
        return request(app)
          .get("/books/get-books")
          .query({ book_name: book2.book_name })
          .expect(200);
      })
      .then(function (response) {
        response.text = JSON.parse(response.text);
        expect(response.text.books.length).to.be.equal(1);
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  //testing update book
  it("testing /books/update-book it should successfully update the book", function (done) {
    let id = "";
    //adding a publisher to the database
    publishersDBController
      .createPublisher(publisher)
      //getting the created publisher id
      .then(function () {
        return publishersDBController.getPublisher(publisher.email);
      })
      //adding a book to the database
      .then(function (data) {
        let publisher_id = data[0].id;
        book.publisher_id = publisher_id;
        return booksDBController.createBook(book);
      })
      //getting the book id
      .then(function () {
        return booksDBController.getBooks({ book_name: book.book_name });
      })
      //sending login request
      .then(function (data) {
        id = data[0].id;
        return request(app)
          .post("/publishers/login")
          .send({
            email: publisher.email,
            account_password: publisher_password,
          })
          .expect(200);
      })
      //sending update book request
      .then(function (response) {
        response.text = JSON.parse(response.text);
        let token = response.text.token;
        return request(app)
          .patch("/books/update-book")
          .set("Cookie", ["token=" + token])
          .field("id", id)
          .field("updateInfo", JSON.stringify({ book_name: "test3" }))
          .expect(200);
      })
      .then(function () {
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  //testing delete book
  it("testing /books/delete-book it should successfully delete the book", function (done) {
    let id = "";
    //adding a publisher to the database
    publishersDBController
      .createPublisher(publisher)
      //getting the created publisher id
      .then(function () {
        return publishersDBController.getPublisher(publisher.email);
      })
      //adding a book to the database
      .then(function (data) {
        let publisher_id = data[0].id;
        book.publisher_id = publisher_id;
        return booksDBController.createBook(book);
      })
      //getting the book id
      .then(function () {
        return booksDBController.getBooks({ book_name: book.book_name });
      })
      //sending login request
      .then(function (data) {
        id = data[0].id;
        return request(app)
          .post("/publishers/login")
          .send({
            email: publisher.email,
            account_password: publisher_password,
          })
          .expect(200);
      })
      //sending delete book request
      .then(function (response) {
        response.text = JSON.parse(response.text);
        let token = response.text.token;
        request(app)
          .delete("/books/delete-book")
          .set("Cookie", ["token=" + token])
          .send({ id })
          .expect(200);
      })
      .then(function () {
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });
});
