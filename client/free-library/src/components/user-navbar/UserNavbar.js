import React, { useRef } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeThemeColor, changeThemeMode } from "../../redux/themeSlice";

const UserNavbar = () => {
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
      pathname: "/home",
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
  //the component
  return (
    <nav className={"navbar navbar-expand-lg navbar-dark bg-" + themeColor}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
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
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                Change Theme
              </a>
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
                          checked={isSelected}
                          onClick={handleThemeModeChange}
                        />
                        <label className="form-check-label" for={mode}>
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
                          checked={isSelected}
                          onClick={handleThemeColorChange}
                        />
                        <label
                          className="form-check-label"
                          for={color.color_name}
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
              <Link className="nav-link" to="/advanced-search">
                Advanced Search
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sign-in">
                Sign In As Publisher
              </Link>
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
export default UserNavbar;
