import React, { useEffect, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Notification from "../notification/Notification";
const DeactivateAccount = () => {
  const [notificationInfo, setNotificationInfo] = useState(null);
  const navigate = useNavigate();
  const themeMode = useSelector((state) => state.theme.mode);
  let bsModalWhiteCloseButtonClass = "";
  if (themeMode === "dark") bsModalWhiteCloseButtonClass = "btn-close-white";
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("publisher", navigate);
  }, [navigate]);
  //handling yes click
  const handleYesClick = () => {
    //deleting the publisher
    axios
      .delete(process.env.REACT_APP_BASE_URL + "/publishers/delete-publisher")
      //sign out in order to delete the current token
      .then(() =>
        axios.delete(process.env.REACT_APP_BASE_URL + "/publishers/sign-out")
      )
      //after successfull account deactivation
      .then(() => {
        setNotificationInfo({
          type: "success",
          message: "Account successfully deactivated",
        });
        return checkLogin("publisher", navigate);
      })
      //an error occured
      .catch((err) =>
        setNotificationInfo({ type: "error", message: err.response.data })
      );
  };
  //the component
  return (
    <>
      {/*modal start*/}
      <div className="modal fade" id="confirm-modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className={"modal-content bg-" + themeMode}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Deactivate Your Account
              </h5>
              <button
                type="button"
                className={"btn-close " + bsModalWhiteCloseButtonClass}
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to deactivate your account? All your books
              will be deleted if you choose to deactivate your account.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleYesClick}
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*modal end*/}
      <h3 className="text-center mb-4 mt-4">Deactivate Your Account</h3>
      <p className="text-danger mb-3 mx-2 fw-bold">
        Warning: This will permanently delete your account, and all your books
        will be deleted.
      </p>
      <div className="row justify-content-center mb-3">
        <button
          className="btn btn-danger w-auto"
          data-bs-toggle="modal"
          data-bs-target="#confirm-modal"
        >
          Deactivate Account
        </button>
      </div>
      <div className="mx-2">
        <Notification notificationInfo={notificationInfo} />
      </div>
    </>
  );
};
export default DeactivateAccount;
