import React, { useEffect, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import getAllSearchParams from "../../functions/getAllSearchParams";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Book from "../book/Book";
const Books = (props) => {
  const [books, setBooks] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const themeMode = useSelector((state) => state.theme.mode);
  useEffect(() => {
    let pageType = "default";
    let requestUrl = "/books/get-books";
    if (props.isPublisher) {
      pageType = "publisher";
      requestUrl = "/books/get-publisher-books";
    }
    //checking if the user is in the correct page type
    checkLogin(pageType, navigate)
      //getting the books
      .then(() =>
        axios.get(process.env.REACT_APP_BASE_URL + requestUrl, {
          params: getAllSearchParams(searchParams),
        })
      )
      //getting the data from the response
      .then((response) => {
        setBooks(response.data.books);
      })
      .catch((err) => console.log(err));
  }, [navigate, props.isPublisher, searchParams]);
  //the component
  return (
    <div className={"d-flex flex-wrap justify-content-center bg-" + themeMode}>
      {books &&
        books.map((book, index) => (
          <Book key={index} isPublisher={props.isPublisher} book={book} />
        ))}
    </div>
  );
};
export default Books;
