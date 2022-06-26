//importing modules
const express = require("express");
const publishersController = require("../controllers/publishers");

//creating the router
const router = express.Router();

//sign in route
router.post("/login", publishersController.login);

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
