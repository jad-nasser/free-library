//importing modules
const express = require("express");
const publishersController = require("../controllers/publishers");

//creating the router
const router = express.Router();

//sign in route
router.post("/login", publishersController.login);

//sign out route
router.delete(
  "/sign-out",
  publishersController.readCookie,
  publishersController.signOut
);

//check if a publisher is signed in to the system
router.get(
  "/check-login",
  publishersController.readCookie,
  publishersController.checkLogin
);

//create publisher account route
router.post("/create-publisher", publishersController.createPublisher);

//this allows the publisher to get his/her account info
router.get(
  "/get-publisher-info",
  publishersController.readCookie,
  publishersController.getPublisherInfo
);

//this allows the publisher to update his/her account
router.patch(
  "/update-publisher",
  publishersController.readCookie,
  publishersController.updatePublisher
);

//this allows the publisher to deactivate his/her account
router.delete(
  "/delete-publisher",
  publishersController.readCookie,
  publishersController.deletePublisher
);

module.exports = router;
