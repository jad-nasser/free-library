//importing modules
const jwt = require("jsonwebtoken");
const publishersDatabaseController = require("../database-controllers/publishers");
const booksDatabaseController = require("../database-controllers/books");
const fs = require("fs");
const bcrypt = require("bcrypt");

//creating a publisher
exports.createPublisher = (req, res) => {
  //checking if some info are missing or not valid and gathering the info
  let info = {};
  if (!req.body.first_name)
    return Promise.reject(res.status(404).send("First name not found"));
  info.first_name = req.body.first_name;
  if (!req.body.last_name)
    return Promise.reject(res.status(404).send("Last name not found"));
  info.last_name = req.body.last_name;
  if (!req.body.account_password)
    return Promise.reject(res.status(404).send("Password not found"));
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  if (!passwordRegex.test(req.body.account_password))
    return Promise.reject(res.status(404).send("Password not valid"));
  info.account_password = req.body.account_password;
  if (!req.body.email)
    return Promise.reject(res.status(404).send("Email not found"));
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(req.body.email))
    return Promise.reject(res.status(404).send("Email not valid"));

  return (
    //checking if an email is already exists
    publishersDatabaseController
      .getPublisher(req.body.email)
      .then((data) => {
        if (data.length > 0) return Promise.reject("Email already exists");
        info.email = req.body.email;
        return true;
      })
      //hashing the password
      .then(() => bcrypt.hash(info.account_password, 10))
      //creating the new publisher in the database
      .then((hashedPassword) => {
        info.account_password = hashedPassword;
        return publishersDatabaseController.createPublisher(info);
      })
      //returning the success message after every thing is done
      .then(() =>
        Promise.resolve(res.status(200).send("Publisher successfully created"))
      )
      .catch((err) => {
        if (err === "Email already exists")
          return Promise.reject(res.status(404).send(err));
        return Promise.reject(res.status(500).json(err));
      })
  );
};

//--------------------------------------------------------------------------------------------------

//log in that returns http only cookie containing the token
exports.login = (req, res) => {
  let id = null;
  //checking if any inputs are missing
  if (!req.body.email || !req.body.account_password)
    return Promise.reject(
      res.status(404).send("Email or password are missing")
    );

  return (
    //checking if the inputs are correct
    publishersDatabaseController
      .getPublisher(req.body.email)
      .then((data) => {
        if (data.length === 0)
          return Promise.reject("Email or password are not correct");
        id = data[0].id;
        return bcrypt.compare(
          req.body.account_password,
          data[0].account_password
        );
      })
      .then((isPasswordCorrect) => {
        if (!isPasswordCorrect)
          return Promise.reject("Email or password are not correct");
        return true;
      })
      //when everything is done correctly a token will be created and returned in a http only cookie
      .then(() => {
        let token = jwt.sign(
          { id, email: req.body.email },
          process.env.TOKEN_SECRET,
          { expiresIn: "24h" }
        );
        res.cookie("token", token, {
          secure: false,
          httpOnly: true,
          expires: new Date(Date.now() + 1 * 1000 * 60 * 60 * 24),
        });
        return res.status(200).json({ token });
      })
      .catch((err) => {
        if (err === "Email or password are not correct")
          return Promise.reject(res.status(404).send(err));
        return Promise.reject(res.status(500).json(err));
      })
  );
};

//----------------------------------------------------------------------------------------------------

//this is middleware for reading the token from the cookie, if there is no token or the token is not valid,
//this middleware will block the next process
exports.readCookie = (req, res, next) => {
  if (!req.body.cookies || !req.body.cookies.token)
    return Promise.reject(res.status(404).send("No token found"));
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.body.cookies.token,
      process.env.TOKEN_SECRET,
      (err, publisher) => {
        if (err) reject(res.status(404).send("Not valid token"));
        else {
          req.body.publisher = publisher;
          next();
          resolve(true);
        }
      }
    );
  });
};

//-------------------------------------------------------------------------------------------------

//getting publisher info without the password, this method can only be requested by the publisher that
//have that info
exports.getPublisherInfo = (req, res) => {
  return publishersDatabaseController
    .getPublisher(req.publisher.email)
    .then((data) => {
      let info = data[0];
      delete info.account_password;
      return res.status(200).json({ publisherInfo: info });
    })
    .catch((err) => Promise.reject(res.status(500).json(err)));
};

//--------------------------------------------------------------------------------------------

//updating publisher account, this can only be done by the publisher
exports.updatePublisher = (req, res) => {
  //gathering the update info
  let info = {};
  if (!req.body.updateInfo)
    return Promise.reject(res.status(404).send("No update info"));
  if (req.body.updateInfo.first_name)
    info.first_name = req.body.updateInfo.first_name;
  if (req.body.updateInfo.last_name)
    info.last_name = req.body.updateInfo.last_name;
  if (req.body.updateInfo.email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(req.body.updateInfo.email))
      return Promise.reject(res.status(404).send("The new email is not valid"));
    info.email = req.body.updateInfo.email;
  }
  if (req.body.updateInfo.new_password) {
    if (!req.body.updateInfo.old_password)
      return Promise.reject(res.status(404).send("Old password not found"));
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
    if (!passwordRegex.test(req.body.updateInfo.new_password))
      return Promise.reject(
        res.status(404).send("The new password is not valid")
      );
    info.account_password = req.body.updateInfo.new_password;
  }
  if (Object.keys(info).length === 0)
    return Promise.reject(res.status(404).send("No update info"));

  return (
    new Promise((resolve, reject) => {
      if (info.email)
        resolve(publishersDatabaseController.getPublisher(info.email));
      resolve("The publisher do not want to update the email");
    })
      //checking if the email is already existing in the database
      .then((data) => {
        if (data !== "The publisher do not want to update the email") {
          if (data.length > 0)
            return Promise.reject("The entered email is already exists");
        }
        if (info.account_password)
          return publishersDatabaseController.getPublisher(req.publisher.email);
        return "The publisher do not want to update the password";
      })
      //checking if the old password provided in the request is correct and hashing the new password in case
      //the publisher want to change the password
      .then((data) => {
        if (data !== "The publisher do not want to update the password") {
          //comparing the old password provided in the request with the account actual password
          return bcrypt.compare(
            req.body.updateInfo.old_password,
            data[0].account_password
          );
        }
        return "The publisher do not want to update the password";
      })
      .then((result) => {
        //checking the compare result of the old password with the current account password
        if (!result) return Promise.reject("Old password is not correct");
        if (result === "The publisher do not want to update the password")
          return "The publisher do not want to update the password";
        //hashing the new password
        return bcrypt.hash(info.account_password, 10);
      })
      //updating the publisher in the database
      .then((data) => {
        if (data !== "The publisher do not want to update the password")
          info.account_password = data;
        publishersDatabaseController.updatePublisher(req.publisher.id, info);
      })
      .then(() => res.status(200).send("Account successfully updated"))
      .catch((err) => {
        if (
          err === "The entered email is already exists" ||
          err === "Old password is not correct"
        )
          return Promise.reject(res.status(404).send(err));
        return Promise.reject(res.status(500).json(err));
      })
  );
};

//--------------------------------------------------------------------------------

//deactivating account, this can only be done by the publisher
exports.deletePublisher = (req, res) => {
  return (
    booksDatabaseController
      .getBooks({ publisher_id: req.publisher.id })
      //deleting all the publisher book's PDF files from the server
      .then((data) => {
        let promises = [];
        for (let i = 0; i < data.length; i++) {
          promises.push(
            new Promise((resolve, reject) => {
              fs.unlink(data[i].file_path, (err) => {
                if (err) reject(err);
                else resolve(true);
              });
            })
          );
        }
        return Promise.all(promises);
      })
      //deleting the publisher and the all the books that belonngs to that publisher from the database
      .then(() => {
        let promises = [];
        promises.push(
          publishersDatabaseController.deletePublisher(req.publisher.id)
        );
        promises.push(
          booksDatabaseController.deleteAllPublisherBooks(req.publisher.id)
        );
        return Promise.all(promises);
      })
      .then(() => res.status(200).send("Account successfully deleted"))
      .catch((err) => {
        return Promise.reject(res.status(500).json(err));
      })
  );
};
