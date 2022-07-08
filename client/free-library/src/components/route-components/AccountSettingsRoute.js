import React from "react";
import { Outlet } from "react-router-dom";
import AccountSettings from "../account-settings/AccountSettings";
const AccountSettingsRoute = () => {
  return (
    <div className="d-md-inline-flex m-md-2">
      <AccountSettings />
      <Outlet />
    </div>
  );
};
export default AccountSettingsRoute;
