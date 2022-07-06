import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AccountSettings = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  return (
    <>
      {/*only for small screens */}

      <nav
        className={
          "navbar navbar-expand-md d-md-none navbar-" +
          themeMode +
          " bg-" +
          themeMode
        }
      >
        <div className="container-fluid justify-content-end">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-center">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/publisher/account-setting/account-info"
                >
                  Account Info
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/publisher/account-setting/change-name"
                >
                  Change Name
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/publisher/account-setting/change-email"
                >
                  Change Email
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/publisher/account-setting/change-password"
                >
                  Change Password
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/publisher/account-setting/deactivate-account"
                >
                  Deactivate Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/*only for large screens */}

      <div className="list-group d-none d-md-block">
        <Link
          to="/publisher/account-setting/account-info"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Account Info
        </Link>
        <Link
          to="/publisher/account-setting/change-name"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Change Name
        </Link>
        <Link
          to="/publisher/account-setting/change-email"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Change Email
        </Link>
        <Link
          to="/publisher/account-setting/change-password"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Change Password
        </Link>
        <Link
          to="/publisher/account-setting/deactivate-account"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Deactivate Account
        </Link>
      </div>
    </>
  );
};
export default AccountSettings;
