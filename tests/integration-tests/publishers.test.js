//importing modules
const app = require("../../app");
const connectToDB = require("../../connect-to-db");
const publishersDBController = require("../../database-controllers/publishers");
const request = require("supertest");
const { expect } = require("chai");

//test data
let publisher = {
  first_name: "test",
  last_name: "test",
  email: "testtest@email.com",
  account_password: "Q1!asdfg",
};

//connecting to the database
const connection = connectToDB("free-library-test");

after(function (done) {
  connection
    .close()
    .then(function () {
      done();
    })
    .catch((err) => done(err));
});
afterEach(function (done) {
  publishersDBController
    .clearTable()
    .then(function () {
      done();
    })
    .catch((err) => done(err));
});

describe("Testing all publisher routes", function () {
  //testing create publisher
  it("testing /publishers/create-publisher it should successfully create a publisher", function (done) {
    request(app)
      .post("/publishers/create-publisher")
      .send(publisher)
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
            account_password: publisher.account_password,
          })
          .expect(200);
      })
      //sending get publisher request
      .then(function (response) {
        let token = response.token;
        return request(app)
          .get("/publishers/get-publisher-info")
          .set("Cookie", ["token=" + token])
          .expect(200);
      })
      .then(function (response) {
        expect(response.publisherInfo).to.be.exist;
        done();
      })
      .catch((err) => done(err));
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
            account_password: publisher.account_password,
          })
          .expect(200);
      })
      //sending update publisher request
      .then(function (response) {
        let token = response.token;
        request(app)
          .patch("/publishers/update-publisher")
          .set("Cookie", ["token=" + token])
          .send({ first_name: "test2", last_name: "test2" })
          .expect(200, done);
      })
      .catch((err) => done(err));
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
            account_password: publisher.account_password,
          })
          .expect(200);
      })
      //sending delete publisher request
      .then(function (response) {
        let token = response.token;
        request(app)
          .delete("/publishers/delete-publisher")
          .set("Cookie", ["token=" + token])
          .expect(200, done);
      })
      .catch((err) => done(err));
  });
});
