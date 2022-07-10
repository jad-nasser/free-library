import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";
const EditPassword = () => {
  const [notificationInfo, setNotificationInfo] = useState(null);
  const [passwordInvalidFeedback, setPasswordInvalidFeedback] =
    useState("Enter new password");
  const passwordInput = useRef(null);
  const oldPasswordInput = useRef(null);
  const confirmPasswordInput = useRef(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("publisher", navigate);
  }, [navigate]);
  //handle password input change
  const handlePasswordInputChange = (e) => {
    confirmPasswordInput.current.pattern = e.target.value;
    if (e.target.validity.valid) setPasswordInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setPasswordInvalidFeedback("Enter new password");
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
      let updateData = {
        new_password: passwordInput.current.value,
        old_password: oldPasswordInput.current.value,
      };
      axios
        .patch(
          process.env.REACT_APP_BASE_URL + "/publishers/update-publisher",
          updateData
        )
        //after successfull password change
        .then(() =>
          setNotificationInfo({
            type: "success",
            message: "Password successfully changed",
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
      <h3 className="text-center mb-4">Change Your Password</h3>
      <div className="mb-3">
        <label>New password</label>
        <input
          type="password"
          className="form-control"
          placeholder="New Password"
          onChange={handlePasswordInputChange}
          ref={passwordInput}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          required
        />
        <div className="invalid-feedback">{passwordInvalidFeedback}</div>
      </div>
      <div className="mb-3">
        <label>Confirm new password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Confirm Password"
          ref={confirmPasswordInput}
          required
        />
        <div className="invalid-feedback">Confirm your password</div>
      </div>
      <div className="mb-4">
        <label>Old password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Old Password"
          ref={oldPasswordInput}
          required
        />
        <div className="invalid-feedback">Enter old password</div>
      </div>
      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-primary">
          Change Password
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default EditPassword;
