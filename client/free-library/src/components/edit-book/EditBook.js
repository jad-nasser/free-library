import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notification from "../notification/Notification";
import FormData from "form-data";
import getAllSearchParams from "../../functions/getAllSearchParams";
import numAbb from "number-abbreviate";
import { useSelector } from "react-redux";
const EditBook = () => {
  const [notificationInfo, setNotificationInfo] = useState(null);
  const [book, setBook] = useState(null);
  const bookNameInput = useRef(null);
  const authorNameInput = useRef(null);
  const bookFileInput = useRef(null);
  const editBookButton = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeMode = useSelector((state) => state.theme.mode);
  let bsModalWhiteCloseButtonClass = "";
  if (themeMode === "dark") bsModalWhiteCloseButtonClass = "btn-close-white";
  useEffect(() => {
    //checking if the user is in the correct page type
    checkLogin("publisher", navigate)
      //getting the book from the database according to the search params
      .then(() =>
        axios.get(process.env.REACT_APP_BASE_URL + "/books/get-books", {
          params: getAllSearchParams(searchParams),
        })
      )
      //getting the book from the response
      .then((response) => setBook(response.data.books[0]))
      .catch((err) => console.log(err));
  }, [navigate, searchParams]);
  //handling edit book click
  const handleEditBookClick = () => {
    const formData = new FormData();
    if (bookNameInput.current.value)
      formData.append("book_name", bookNameInput.current.value);
    if (authorNameInput.current.value)
      formData.append("author", authorNameInput.current.value);
    if (bookFileInput.current.files.length > 0)
      formData.append(
        "book-file",
        bookFileInput.current.files[0],
        bookFileInput.current.files[0].name
      );
    axios
      .patch(process.env.REACT_APP_BASE_URL + "/books/update-book", formData)
      //after the book is successfully added
      .then(() =>
        setNotificationInfo({
          type: "success",
          message: "Book successfully updated",
        })
      )
      //an error occured
      .catch((err) =>
        setNotificationInfo({ type: "error", message: err.response.data })
      );
  };
  //handle yes click
  const handleYesClick = () => {
    axios
      .delete(process.env.REACT_APP_BASE_URL + "/books/delete-book", {
        id: book.id,
      })
      .then(() =>
        setNotificationInfo({
          type: "success",
          message: "Book successfully deleted",
        })
      )
      .catch((err) =>
        setNotificationInfo({ type: "error", message: err.response.data })
      );
  };
  //handle input change
  const handleInputChange = () => {
    if (
      bookNameInput.current.value ||
      authorNameInput.current.value ||
      bookFileInput.current.files.length > 0
    )
      editBookButton.current.disabled = false;
    else editBookButton.current.disabled = true;
  };
  //the component
  return (
    <>
      {book && (
        <>
          {/*modal start*/}
          <div className="modal fade" id="confirm-modal" tabIndex="-1">
            <div className="modal-dialog">
              <div className={"modal-content bg-" + themeMode}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete This Book
                  </h5>
                  <button
                    type="button"
                    className={"btn-close " + bsModalWhiteCloseButtonClass}
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this book?
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
          <div className="form-container my-3 mx-auto">
            <h1 className="text-center">{book.book_name}</h1>
            <h3 className="text-center mb-3">{"By " + book.author}</h3>
            <h6 className="text-center mb-4">
              {numAbb(book.number_of_downloads, 1) + " downloads"}
            </h6>
            <div className="mb-3">
              <label className="form-label" htmlFor="book-name-input">
                Change Book Name
              </label>
              <input
                type="text"
                className="form-control"
                id="book-name-input"
                placeholder="Change Book Name"
                onChange={handleInputChange}
                ref={bookNameInput}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="author-name-input">
                Change Author Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Change Author Name"
                id="author-name-input"
                onChange={handleInputChange}
                ref={authorNameInput}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="book-file-input" className="form-label">
                Change Book PDF File
              </label>
              <input
                type="file"
                className="form-control"
                id="book-file-input"
                data-testid="book-file-input"
                accept=".pdf"
                onChange={handleInputChange}
                ref={bookFileInput}
              />
            </div>
            <p className="fw-bold">
              Note: Its not necessary to fill all the inputs, you only need to
              fill the inputs that you need to change.
            </p>
            <div className="d-flex mb-3 justify-content-between">
              <button
                className="btn btn-primary"
                onClick={handleEditBookClick}
                ref={editBookButton}
                disabled
              >
                Edit Book
              </button>
              <button
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#confirm-modal"
              >
                Delete Book
              </button>
            </div>
            <Notification notificationInfo={notificationInfo} />
          </div>
        </>
      )}
    </>
  );
};
export default EditBook;
