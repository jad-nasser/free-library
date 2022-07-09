import React, { useEffect, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import getAllSearchParams from "../../functions/getAllSearchParams";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import numAbb from "number-abbreviate";
const ViewBook = () => {
  const [book, setBook] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const themeMode = useSelector((state) => state.theme.mode);
  let textColor = "dark";
  if (themeMode === "dark") textColor = "light";
  //handling download button click
  const handleDownloadClick = () => {
    axios
      .get(process.env.REACT_APP_BASE_URL + "/books/download-book", {
        params: { id: book.id },
      })
      .catch((err) => console.log(err));
  };
  //getting the book
  useEffect(() => {
    //checking if the user is in the correct page type
    checkLogin("default", navigate)
      //after checking that the user is in the correct page type, getting the book
      .then(() =>
        axios.get(process.env.REACT_APP_BASE_URL + "/books/get-books", {
          params: getAllSearchParams(searchParams),
        })
      )
      //getting the data from the response
      .then((response) => {
        setBook(response.data.books[0]);
      })
      .catch((err) => console.log(err));
  }, [navigate, searchParams]);
  //the component
  return (
    <div className={"text-center m-4 bg-" + themeMode + " text-" + textColor}>
      {book && (
        <>
          <p className="mb-2" style={{ fontSize: "2em" }}>
            <strong>{book.book_name}</strong>
          </p>
          <p className="mb-2" style={{ fontSize: "1.17em" }}>
            {"By " + book.author}
          </p>
          <p className="mb-3" style={{ fontSize: "0.83em" }}>
            {numAbb(book.number_of_downloads, 1) + " downloads"}
          </p>
          <div className="row justify-content-center">
            <button
              className="btn btn-primary w-auto"
              onClick={handleDownloadClick}
            >
              Download
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default ViewBook;
