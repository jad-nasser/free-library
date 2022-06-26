//importing modules
const app = require("../../app");
const { connect } = require("../../connect-to-db");
const publishersDBController = require("../../database-controllers/publishers");
const request = require("supertest");
const { expect } = require("chai");
const bcrypt = require("bcrypt");
require("dotenv").config();

//test data
let publisher_password = "Q1!asdfg";
let publisher = {
  first_name: "test",
  last_name: "test",
  email: "testtest@email.com",
};

let connection = null;

before(function (done) {
  connect("free-library-test")
    .then(function (pool) {
      connection = pool;
      return bcrypt.hash(publisher_password, 10);
    })
    .then(function (hashedPassword) {
      publisher.account_password = hashedPassword;
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
  publishersDBController
    .clearTable()
    .then(function () {
      done();
    })
    .catch(function (err) {
      done(err);
    });
});

describe("Testing all publisher routes", function () {
  //testing create publisher
  it("testing /publishers/create-publisher it should successfully create a publisher", function (done) {
    let publisherInfo = Object.assign({}, publisher);
    publisherInfo.account_password = publisher_password;
    request(app)
      .post("/publishers/create-publisher")
      .send(publisherInfo)
      .expect(200, done);
  });

  //testing get publisher info
  it("testing /publishers/get-publisher-info it should successfully return the publisher info", function (done) {
    //adding a publisher to the database
    publishersDBController
      .createPublisher(publisher)
      //sending sign in request
      .then(function () {
        return request(app)
          .post("/publishers/login")
          .send({
            email: publisher.email,
            account_password: publisher_password,
          })
          .expect(200);
      })
      //sending get publisher request
      .then(function (response) {
        response.text = JSON.parse(response.text);
        let token = response.text.token;
        return request(app)
          .get("/publishers/get-publisher-info")
          .set("Cookie", ["token=" + token])
          .expect(200);
      })
      .then(function (response) {
        response.text = JSON.parse(response.text);
        expect(response.text.publisherInfo).to.be.exist;
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  //testing update publisher
  it("testing /publishers/update-publisher it should successfully update the publisher", function (done) {
    //adding a publisher to the database
    publishersDBController
      .createPublisher(publisher)
      //sending sign in request
      .then(function () {
        return request(app)
          .post("/publishers/login")
          .send({
            email: publisher.email,
            account_password: publisher_password,
          })
          .expect(200);
      })
      //sending update publisher request
      .then(function (response) {
        response.text = JSON.parse(response.text);
        let token = response.text.token;
        request(app)
          .patch("/publishers/update-publisher")
          .set("Cookie", ["token=" + token])
          .send({ first_name: "test2", last_name: "test2" })
          .expect(200);
      })
      .then(function () {
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  //testing delete publisher
  it("testing /publishers/delete-publisher it should successfully delete the publisher", function (done) {
    //adding a publisher to the database
    publishersDBController
      .createPublisher(publisher)
      //sending sign in request
      .then(function () {
        return request(app)
          .post("/publishers/login")
          .send({
            email: publisher.email,
            account_password: publisher_password,
          })
          .expect(200);
      })
      //sending delete publisher request
      .then(function (response) {
        response.text = JSON.parse(response.text);
        let token = response.text.token;
        request(app)
          .delete("/publishers/delete-publisher")
          .set("Cookie", ["token=" + token])
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
