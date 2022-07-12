import React from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import numAbb from "number-abbreviate";
const Book = (props) => {
  const navigate = useNavigate();
  const handleBookClick = () => {
    if (props.isPublisher)
      navigate({
        pathname: "/publisher/edit-book",
        search: createSearchParams({ id: props.book.id }).toString(),
      });
    else
      navigate({
        pathname: "/view-book",
        search: createSearchParams({ id: props.book.id }).toString(),
      });
  };
  return (
    <div
      className="card text-center m-2"
      style={{ width: "20em", cursor: "pointer" }}
      onClick={handleBookClick}
    >
      <div className="card-body">
        <h5 className="card-title text-dark">{props.book.book_name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {"By " + props.book.author}
        </h6>
        <p className="card-text">
          <small className="text-muted">
            {numAbb(props.book.number_of_downloads, 1) + " downloads"}
          </small>
        </p>
      </div>
    </div>
  );
};
export default Book;
