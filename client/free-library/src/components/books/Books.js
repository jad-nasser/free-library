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
    //checking if the user is in the correct page type
    let userType = "default";
    if (props.isPublisher) userType = "publisher";
    checkLogin(userType, navigate)
      //after checking that the user is in the correct page type, getting the books according to the
      //provided query
      .then(() =>
        axios.get(process.env.REACT_APP_BASE_URL + "/books/get-books", {
          params: getAllSearchParams(searchParams),
        })
      )
      //getting the data from the response
      .then((response) => {
        setBooks(response.data.books);
      })
      .catch((err) => console.log(err));
  }, [navigate]);
  //the component
  return (
    <div className={"d-flex bg-" + themeMode}>
      {books &&
        books.map((book, index) => (
          <Book key={index} isPublisher={props.isPublisher} book={book} />
        ))}
    </div>
  );
};
export default Books;
