import React, { useEffect, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AccountInfo = () => {
  const [publisherInfo, setPublisherInfo] = useState({
    first_name: null,
    last_name: null,
    email: null,
  });
  const navigate = useNavigate();
  const themeMode = useSelector((state) => state.theme.mode);
  let textColor = "dark";
  if (themeMode === "dark") textColor = "light";
  useEffect(() => {
    //making sure that the publisher is logged in
    checkLogin("publisher", navigate)
      //after checking that the publisher is logged in, getting the publisher account info
      .then(() =>
        axios.get(
          process.env.REACT_APP_BASE_URL + "/publishers/get-publisher-info"
        )
      )
      //getting the data from the response
      .then((response) => {
        setPublisherInfo(response.data.publisherInfo);
      })
      .catch((err) => console.log(err));
  }, [navigate]);
  return (
    <div
      className={
        "d-flex justify-content-center text-" + textColor + " bg-" + themeMode
      }
    >
      <div className="mt-4">
        <div className="mb-2">
          <span className="me-2">
            <strong>First Name:</strong>
          </span>
          <span>{publisherInfo.first_name}</span>
        </div>
        <div className="mb-2">
          <span className="me-2">
            <strong>Last Name:</strong>
          </span>
          <span>{publisherInfo.last_name}</span>
        </div>
        <div className="mb-2">
          <span className="me-2">
            <strong>Email:</strong>
          </span>
          <span>{publisherInfo.email}</span>
        </div>
      </div>
    </div>
  );
};
export default AccountInfo;
