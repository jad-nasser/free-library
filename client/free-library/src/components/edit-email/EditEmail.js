import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";
const EditEmail = () => {
  const [notificationInfo, setNotificationInfo] = useState(null);
  const [emailInvalidFeedback, setEmailInvalidFeedback] =
    useState("Enter new email");
  const emailInput = useRef(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("publisher", navigate);
  }, [navigate]);
  //handle email input change
  const handleEmailInputChange = (e) => {
    if (e.target.validity.valid) setEmailInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setEmailInvalidFeedback("Enter new email");
    else if (e.target.validity.patternMismatch)
      setEmailInvalidFeedback("Enter a valid email");
  };
  //handling form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      let updateData = {
        email: emailInput.current.value,
      };
      axios
        .patch(
          process.env.REACT_APP_BASE_URL + "/publishers/update-publisher",
          updateData
        )
        //after successfull update
        .then(() =>
          setNotificationInfo({
            type: "success",
            message: "Email successfully changed",
          })
        )
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
      <h3 className="text-center mb-4">Change Your Email Address</h3>
      <div className="mb-3">
        <label>New email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="New Email"
          onChange={handleEmailInputChange}
          ref={emailInput}
          pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
          required
        />
        <div className="invalid-feedback">{emailInvalidFeedback}</div>
      </div>
      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-primary">
          Change Email
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default EditEmail;
