import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";
import FormData from "form-data";
const AddBook = () => {
  const [notificationInfo, setNotificationInfo] = useState(null);
  const bookNameInput = useRef(null);
  const authorNameInput = useRef(null);
  const bookFileInput = useRef(null);
  const navigate = useNavigate();
  /*
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("publisher", navigate);
  }, [navigate]);
  */
  //handling form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      const formData = new FormData();
      formData.append("book_name", bookNameInput.current.value);
      formData.append("author", authorNameInput.current.value);
      formData.append(
        "book-file",
        bookFileInput.current.file,
        bookFileInput.current.file.name
      );
      axios
        .post(process.env.REACT_APP_BASE_URL + "/books/create-book", formData)
        //after the book is successfully added
        .then(() =>
          setNotificationInfo({
            type: "success",
            message: "Book successfully added",
          })
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
      <h3 className="text-center mb-4">Add New Book</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="book-name-input">
          Book Name
        </label>
        <input
          type="text"
          className="form-control"
          id="book-name-input"
          placeholder="Book Name"
          ref={bookNameInput}
          required
        />
        <div className="invalid-feedback">Enter book name</div>
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
          required
        />
        <div className="invalid-feedback">Enter author name</div>
      </div>
      <div className="mb-5">
        <label htmlFor="book-file-input" className="form-label">
          Book PDF File
        </label>
        <input
          type="file"
          className="form-control"
          id="book-file-input"
          data-testid="book-file-input"
          accept=".pdf"
          ref={bookFileInput}
          required
        />
        <div className="invalid-feedback">Select book file</div>
      </div>
      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-primary">
          Add Book
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default AddBook;
