import React, { useEffect, useRef } from "react";
import checkLogin from "../../functions/checkLogin";
import { useNavigate, createSearchParams } from "react-router-dom";
const AdvancedSearch = () => {
  const bookNameInput = useRef(null);
  const authorNameInput = useRef(null);
  const sortBy = useRef("alphabetical-order");
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("default", navigate);
  }, [navigate]);
  //handling search click
  const handleSearchClick = () => {
    let searchParams = { sort_by: sortBy.current };
    if (bookNameInput.current.value)
      searchParams.book_name = bookNameInput.current.value;
    if (authorNameInput.current.value)
      searchParams.author = authorNameInput.current.value;
    navigate({
      pathname: "/home",
      search: createSearchParams(searchParams).toString(),
    });
  };
  //handling sort select
  const handleSortSelect = (e) => {
    sortBy.current = e.target.value;
  };
  //the component
  return (
    <div className="form-container my-5 mx-auto">
      <h3 className="text-center mb-4">Advanced Search</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="book-name-input">
          Book Name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Book Name"
          id="book-name-input"
          ref={bookNameInput}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="author-name-input">
          Author Name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Author Name"
          id="author-name-input"
          ref={authorNameInput}
        />
      </div>
      <div className="mb-4">
        <p className="mb-1">Sort By:</p>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortBy"
            id="alphabetical-radio"
            onClick={handleSortSelect}
            value="alphabetical-order"
            defaultChecked
          />
          <label className="form-check-label" htmlFor="alphabetical-radio">
            Alphabetical Order
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortBy"
            id="reverse-alphabetical-radio"
            value="alphabetical-order-reverse"
            onClick={handleSortSelect}
          />
          <label
            className="form-check-label"
            htmlFor="reverse-alphabetical-radio"
          >
            Reversed Alphabetical Order
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortBy"
            id="most-downloaded-radio"
            value="most-downloaded"
            onClick={handleSortSelect}
          />
          <label className="form-check-label" htmlFor="most-downloaded-radio">
            Most Downloaded
          </label>
        </div>
      </div>
      <div className="d-grid mb-3">
        <button className="btn btn-primary" onClick={handleSearchClick}>
          Search
        </button>
      </div>
    </div>
  );
};
export default AdvancedSearch;
