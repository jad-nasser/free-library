//importing modules
import axios from "axios";

//there are two pages types: "publisher" pages are pages only for publishers, and "default" pages are
//pages that are for the normal users that are not publishers.
//the aim of this function is to check if the user is in the correct page type and if not it navigates the
//user to other page.
//this function take the current page type that the user is trying to access and the navigate function
const checkLogin = (pageType, navigate) => {
  return (
    axios
      .get(process.env.REACT_APP_BASE_URL + "/publishers/check-login")
      //the user is signed in as a publisher
      .then(() => {
        if (pageType !== "publisher") navigate("/publisher/home");
      })
      //the user is not signed in as a publisher
      .catch(() => {
        if (pageType !== "default") navigate("/sign-in");
      })
  );
};
export default checkLogin;
