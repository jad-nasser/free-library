import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";
const EditName = () => {
  const [notificationInfo, setNotificationInfo] = useState(null);
  const firstNameInput = useRef(null);
  const lastNameInput = useRef(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("publisher", navigate);
  }, [navigate]);
  //handling form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      let updateData = {
        first_name: firstNameInput.current.value,
        last_name: lastNameInput.current.value,
      };
      axios
        .patch(
          process.env.REACT_APP_BASE_URL + "/publishers/update-publisher",
          updateData
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
      <h3 className="text-center mb-4">Change Your Name</h3>
      <div className="mb-3">
        <label>First name</label>
        <input
          type="text"
          className="form-control"
          placeholder="New First Name"
          ref={firstNameInput}
          required
        />
        <div className="invalid-feedback">Enter new first name</div>
      </div>
      <div className="mb-4">
        <label>Last name</label>
        <input
          type="text"
          className="form-control"
          placeholder="New Last Name"
          ref={lastNameInput}
          required
        />
        <div className="invalid-feedback">Enter new last name</div>
      </div>
      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-primary">
          Change Name
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default EditName;
