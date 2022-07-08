import React from "react";
import { Outlet } from "react-router-dom";
import PublisherNavbar from "../publisher-navbar/PublisherNavbar";
const Publisher = () => {
  return (
    <>
      <PublisherNavbar />
      <Outlet />
    </>
  );
};
export default Publisher;
