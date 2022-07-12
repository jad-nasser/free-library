import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Notification from "../notification/Notification";
const SignUp = () => {
  const [notificationInfo, setNotificationInfo] = useState(null);
  const [emailInvalidFeedback, setEmailInvalidFeedback] =
    useState("Enter your email");
  const [passwordInvalidFeedback, setPasswordInvalidFeedback] = useState(
    "Enter your password"
  );
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);
  const firstNameInput = useRef(null);
  const lastNameInput = useRef(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("default", navigate);
  }, [navigate]);
  //handle email input change
  const handleEmailInputChange = (e) => {
    if (e.target.validity.valid) setEmailInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setEmailInvalidFeedback("Enter your email");
    else if (e.target.validity.patternMismatch)
      setEmailInvalidFeedback("Enter a valid email");
  };
  //handle password input change
  const handlePasswordInputChange = (e) => {
    confirmPasswordInput.current.pattern = e.target.value;
    if (e.target.validity.valid) setPasswordInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setPasswordInvalidFeedback("Enter your password");
    else if (e.target.validity.patternMismatch)
      setPasswordInvalidFeedback(
        "Password should contains at least 8 characters, containing one lowercase, uppercase, number, and special character from the following: @$!%*?&"
      );
  };
  //handling form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      let signUpData = {
        first_name: firstNameInput.current.value,
        last_name: lastNameInput.current.value,
        email: emailInput.current.value,
        account_password: passwordInput.current.value,
      };
      axios
        .post(
          process.env.REACT_APP_BASE_URL + "/publishers/create-publisher",
          signUpData
        )
        //after successfull sign up
        .then(() => {
          setNotificationInfo({
            type: "success",
            message: "Account successfully created",
          });
          navigate("/sign-in");
        })
        //an error occured
        .catch((err) =>
          setNotificationInfo({ type: "error", message: err.response.data })
        );
    }
  };
  //the component
  return (
    <form
      className="form-container my-5 mx-auto needs-validation"
      onSubmit={handleFormSubmit}
      noValidate
    >
      <h3 className="text-center mb-4">Sign Up As Publisher</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="first-name-input">
          First name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="First Name"
          id="first-name-input"
          ref={firstNameInput}
          required
        />
        <div className="invalid-feedback">Enter your first name</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="last-name-input">
          Last name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Last Name"
          id="last-name-input"
          ref={lastNameInput}
          required
        />
        <div className="invalid-feedback">Enter your last name</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="email-input">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          id="email-input"
          onChange={handleEmailInputChange}
          ref={emailInput}
          pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
          required
        />
        <div className="invalid-feedback">{emailInvalidFeedback}</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password-input">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          id="password-input"
          onChange={handlePasswordInputChange}
          ref={passwordInput}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          required
        />
        <div className="invalid-feedback">{passwordInvalidFeedback}</div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="confirm-password-input">
          Confirm password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Confirm Password"
          id="confirm-password-input"
          ref={confirmPasswordInput}
          required
        />
        <div className="invalid-feedback">Confirm your password</div>
      </div>
      <div className="d-grid mb-2">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="mb-3 text-secondary">
        Already registered?{" "}
        <Link to="/sign-in" className="text-decoration-none">
          Sign in
        </Link>
      </p>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default SignUp;
