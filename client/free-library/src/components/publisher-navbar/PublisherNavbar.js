import React, { useRef } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeThemeColor, changeThemeMode } from "../../redux/themeSlice";
import axios from "axios";
import checkLogin from "../../functions/checkLogin";

const PublisherNavbar = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const themeMode = useSelector((state) => state.theme.mode);
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //theme colors and modes that the user can select
  const colorObject = (color_name, bs_color) => {
    return { color_name, bs_color };
  };
  const themeModes = ["Light", "Dark"];
  const themeColors = [
    colorObject("Blue", "primary"),
    colorObject("Red", "danger"),
    colorObject("Green", "success"),
    colorObject("Orange", "warning"),
    colorObject("Aqua", "info"),
    colorObject("Grey", "secondary"),
  ];
  //handling search button click
  const handleSearchClick = () => {
    let params = {
      book_name: searchInput.current.value,
    };
    if (params.book_name === "") params = {};
    navigate({
      pathname: "/publisher/home",
      search: createSearchParams(params).toString(),
    });
  };
  //handling theme mode change
  const handleThemeModeChange = (e) => {
    dispatch(changeThemeMode(e.target.value));
  };
  //handling theme color change
  const handleThemeColorChange = (e) => {
    dispatch(changeThemeColor(e.target.value));
  };
  //handling sign out click
  const handleSignOutClick = () => {
    axios
      .delete(process.env.REACT_APP_BASE_URL + "/publishers/sign-out")
      .then(() => checkLogin("publisher", navigate))
      .catch((err) => console.log(err));
  };
  //the component
  return (
    <nav className={"navbar navbar-expand-lg navbar-dark bg-" + themeColor}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/publisher/home">
          Free Library
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
              >
                Change Theme
              </button>
              <div className="dropdown-menu p-4">
                <div className="mb-2">
                  Theme Mode:
                  {themeModes.map((mode, index) => {
                    let isSelected = false;
                    if (mode.toLowerCase() === themeMode) isSelected = true;
                    return (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="themeMode"
                          id={mode.toLowerCase()}
                          value={mode.toLowerCase()}
                          defaultChecked={isSelected}
                          onClick={handleThemeModeChange}
                        />
                        <label className="form-check-label" htmlFor={mode}>
                          {mode}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div>
                  Theme Color:
                  {themeColors.map((color, index) => {
                    let isSelected = false;
                    if (themeColor === color.bs_color) isSelected = true;
                    return (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="themeColor"
                          id={color.color_name}
                          value={color.bs_color}
                          defaultChecked={isSelected}
                          onClick={handleThemeColorChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={color.color_name}
                        >
                          {color.color_name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/publisher/add-book">
                Add New Book
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/publisher/account-settings">
                Account Settings
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={handleSignOutClick}
              >
                Sign Out
              </button>
            </li>
          </ul>
          <div className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              ref={searchInput}
            />
            <button
              className="btn btn-outline-light"
              onClick={handleSearchClick}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default PublisherNavbar;
