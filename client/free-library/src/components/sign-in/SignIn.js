import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";
const SignIn = () => {
  const [notificationInfo, setNotificationInfo] = useState(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("default", navigate);
  }, [navigate]);
  //handling sign in click
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      let loginData = {
        email: emailInput.current.value,
        account_password: passwordInput.current.value,
      };
      axios
        .post(process.env.REACT_APP_BASE_URL + "/publishers/login", loginData)
        //after successfull sign in
        .then(() => checkLogin("default", navigate))
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
      <h3 className="text-center">Sign In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          ref={emailInput}
          required
        />
        <div className="invalid-feedback">Enter email</div>
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          ref={passwordInput}
          required
        />
        <div className="invalid-feedback">Enter password</div>
      </div>
      <div className="d-grid mb-4">
        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default SignIn;
