//importing modules
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { expect } = require("chai");
const publishersController = require("../../controllers/publishers");
const jwt = require("jsonwebtoken");

//creating mock request and response objects
const request = {
  body: {},
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

//test data
const publisher = {
  first_name: "test",
  last_name: "test",
  email: "testtest@email.com",
  account_password: "1!Qwasdf",
};

//removing all stubs after each test
afterEach(function () {
  sinon.restore();
});

describe("Testing publisher controller", function () {
  describe("Testing createPublisher()", function () {
    //testing createPublisher() when sending empty request
    it('Should return 404 response with message "First name not found"', function (done) {
      let req = Object.assign({}, request);
      let res = Object.assign({}, response);
      publishersController
        .createPublisher(req, res)
        .then(function () {
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("First name not found");
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    //testing createPublisher() when the email is not valid
    it('Should return 404 response with message "Email not valid"', function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body = Object.assign({}, publisher);
      let res = Object.assign({}, response);
      //adding a not valid email
      req.body.email = "blablabla";
      //calling the method
      publishersController
        .createPublisher(req, res)
        .then(function () {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Email not valid");
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    //testing createPublisher() when the password is not valid
    it('Should return 404 response with message "Password not valid"', function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body = Object.assign({}, publisher);
      let res = Object.assign({}, response);
      //adding a not valid password
      req.body.password = "blablabla";
      //calling the method
      publishersController
        .createPublisher(req, res)
        .then(function () {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Password not valid");
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    //testing createPublisher() when assuming that the email is already exists
    it('Should return 404 response with message "Email already exists"', function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body = Object.assign({}, publisher);
      let res = Object.assign({}, response);
      //stubbing the database controller method getPublisher()
      let getPublisherStub = sinon.stub().returns(
        new Promise(function (resolve, reject) {
          let result = { data: [{ email: "testtest@email.com" }] };
          resolve(result);
        })
      );
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          getPublisher: getPublisherStub,
        },
      });
      //calling the method
      controller
        .createPublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Email already exists");
          expect(getPublisherStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing createPublisher() when everything is done correctly
    it('Should return 200 response with message "Publisher successfully created"', function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body = Object.assign({}, publisher);
      let res = Object.assign({}, response);
      //stubbing the database controller methods getPublisher() and createPublisher()
      let getPublisherStub = sinon
        .stub()
        .returns(Promise.resolve({ data: [] }));
      let createPublisherStub = sinon.stub().returns(Promise.resolve(true));
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          getPublisher: getPublisherStub,
          createPublisher: createPublisherStub,
        },
      });
      //calling the method
      controller
        .createPublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(200);
          expect(res.data).to.be.equal("Publisher successfully created");
          expect(getPublisherStub.calledOnce).to.be.true;
          expect(createPublisherStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Testing login()", function () {
    //testing login() when sending empty request
    it('Should return 404 response with message "Email or password are missing"', function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      let res = Object.assign({}, response);
      //calling the method
      publishersController
        .login(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Email or password are missing");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing login() when email or password are not correct
    it("Should return 404 response with message 'Email or password are not correct'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body = {
        email: publisher.email,
        accoun_password: publisher.account_password,
      };
      let res = Object.assign({}, response);
      //stubbing the database controller method getPublisher()
      let getPublisherStub = sinon.stub().returns(
        Promise.resolve({
          data: [{ email: publisher.email, account_password: "blabla" }],
        })
      );
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          getPublisher: getPublisherStub,
        },
      });
      //calling the method
      controller
        .login(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Email or password are not correct");
          expect(getPublisherStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing login() when everything is done correctly
    it("Should return 200 response with a token", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body = {
        email: publisher.email,
        accoun_password: publisher.account_password,
      };
      let res = Object.assign({}, response);
      //stubbing the database controller method getPublisher()
      let getPublisherStub = sinon
        .stub()
        .returns(Promise.resolve({ data: [publisher] }));
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          getPublisher: getPublisherStub,
        },
      });
      //calling the method
      controller
        .login(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(200);
          expect(res.data.token).to.be.exist;
          expect(getPublisherStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Testing readCookie() middleware", function () {
    //testing readCookie() with no token
    it("Should return 404 response with message 'No token found'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      let res = Object.assign({}, response);
      //calling the method
      publishersController
        .login(req, res, () => {})
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("No token found");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing readCookie() with a not valid token
    it("Should return 404 response with message 'Not valid token'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.cookies = { token: "not valid" };
      let res = Object.assign({}, response);
      //calling the method
      publishersController
        .login(req, res, () => {})
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Not valid token");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing readCookie() with a valid token
    it("The request should contains publisher object", function (done) {
      //creating a test token
      let token = jwt.sign(
        { id: "1", email: publisher.email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "24h",
        }
      );
      //creating mock request and response
      let req = Object.assign({}, request);
      req.cookies = { token };
      let res = Object.assign({}, response);
      //calling the method
      publishersController
        .login(req, res, () => {})
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(200);
          expect(req.publisher).to.be.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Testing getPublisherInfo()", function () {
    //testing getPublisherInfo()
    it("Should return 200 response with publisherInfo", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //stubbing the database controller method getPublisher()
      let getPublisherStub = sinon
        .stub()
        .returns(Promise.resolve({ data: [publisher] }));
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          getPublisher: getPublisherStub,
        },
      });
      //calling the method
      controller
        .getPublisherInfo(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(200);
          expect(res.data.publisherInfo).to.be.exist;
          expect(getPublisherStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Testing updatePublisher()", function () {
    //testing updatePublisher() when sending request with empty update info
    it("Should return 404 response with message 'No update info'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //calling the method
      publishersController
        .updatePublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("No update info");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing updatePublisher() when sending new_password without old_password
    it("Should return 404 response with a message 'Old password not found'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.updateInfo = { new_password: "1!Qwasdf" };
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //calling the method
      publishersController
        .updatePublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Old password not found");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing updatePublisher() when sending new_password that is not valid
    it("Should return 404 response with a message 'The new password is not valid'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.updateInfo = {
        old_password: "1!Qwasdf",
        new_password: "blabla",
      };
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //calling the method
      publishersController
        .updatePublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("The new password is not valid");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing updatePublisher() when sending old_password that is not equal to the current password
    it("Should return 404 response with a message 'Old password is not correct'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.updateInfo = {
        old_password: "2!Qwasdf",
        new_password: "3!Qwasdf",
      };
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //stubbing the database controller method getPublisher()
      let getPublisherStub = sinon
        .stub()
        .returns(Promise.resolve({ data: [publisher] }));
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          getPublisher: getPublisherStub,
        },
      });
      //calling the method
      controller
        .updatePublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("Old password is not correct");
          expect(getPublisherStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing updatePublisher() when sending a not valid email
    it("Should return 404 response with a message 'The new email is not valid'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.updateInfo = {
        email: "blabla",
      };
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //calling the method
      publishersController
        .updatePublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("The new email is not valid");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing updatePublisher() when sending an already existing email
    it("Should return 404 response with a message 'The entered email is already exists'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.updateInfo = {
        email: "test@email.com",
      };
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //stubbing the database controller method getPublisher()
      let getPublisherStub = sinon
        .stub()
        .returns(Promise.resolve({ data: [{ email: "test@email.com" }] }));
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          getPublisher: getPublisherStub,
        },
      });
      //calling the method
      controller
        .updatePublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(404);
          expect(res.data).to.be.equal("The entered email is already exists");
          expect(getPublisherStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    //testing updatePublisher() when everything is done correctly
    it("Should return 200 response with a message 'Account successfully updated'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.body.updateInfo = {
        old_password: publisher.account_password,
        new_password: "3!Qwasdf",
      };
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //stubbing the database controller methods getPublisher() and updatePublisher()
      let getPublisherStub = sinon
        .stub()
        .returns(Promise.resolve({ data: [publisher] }));
      let updatePublisherStub = sinon.stub().returns(Promise.resolve(true));
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          getPublisher: getPublisherStub,
          updatePublisher: updatePublisherStub,
        },
      });
      //calling the method
      controller
        .updatePublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(200);
          expect(res.data).to.be.equal("Account successfully updated");
          expect(getPublisherStub.calledOnce).to.be.true;
          expect(updatePublisherStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Testing deletePublisher()", function () {
    //testing deletePublisher()
    it("Should return 200 response with a message 'Account successfully deleted'", function (done) {
      //creating mock request and response
      let req = Object.assign({}, request);
      req.publisher = { id: "1", email: publisher.email };
      let res = Object.assign({}, response);
      //stubbing the database controller methods getPublisher() and updatePublisher()
      let deletePublisherStub = sinon.stub().returns(Promise.resolve(true));
      let deleteAllPublisherBooksStub = sinon
        .stub()
        .returns(Promise.resolve(true));
      let controller = proxyquire("../../controllers/publishers", {
        "../database-controllers/publishers": {
          deletePublisher: deletePublisherStub,
        },
        "../database-controllers/books": {
          deleteAllPublisherBooks: deleteAllPublisherBooksStub,
        },
      });
      //calling the method
      controller
        .deletePublisher(req, res)
        .then(() => {
          //assertion
          expect(res.statusCode).to.be.equal(200);
          expect(res.data).to.be.equal("Account successfully deleted");
          expect(deletePublisherStub.calledOnce).to.be.true;
          expect(deleteAllPublisherBooksStub.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
