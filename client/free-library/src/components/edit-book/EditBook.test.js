//importing modules
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import EditBook from "./EditBook";

//mocking scrollIntoView()
window.HTMLElement.prototype.scrollIntoView = () => {};

//creating a mock book
const book = { book_name: "test", author: "test", file_path: "blabla.pdf" };

//creating a mock server
const server = setupServer(
  rest.patch(
    process.env.REACT_APP_BASE_URL + "/books/update-book",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.delete(
    process.env.REACT_APP_BASE_URL + "/books/delete-book",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    process.env.REACT_APP_BASE_URL + "/publishers/check-login",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(true));
    }
  )
);

before(() => server.listen());
beforeEach(() => server.resetHandlers());
after(() => server.close());

describe("Testing EditBook component", () => {
  //with empty inputs
  test("Testing the component without inserting any input, the 'Update Book' button should be disabled", () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditBook book={book} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("Update Book")).toBeDisabled();
  });

  //when clicking 'Delete Book'
  test("Testing the component when clicking the 'Delete Book' it should shows 'Book successfully deleted'", () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditBook book={book} />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Delete Book"));
    //assertions
    waitFor(() => screen.getByText("Book successfully deleted")).then(() => {
      expect(screen.getByText("Book successfully deleted")).toBeVisible();
    });
  });

  //when server sends an error
  test("Testing the component when the server send an error it should display the error", () => {
    //making the mock server sends an error
    server.use(
      rest.patch(
        process.env.REACT_APP_BASE_URL + "/books/update-book",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditBook book={book} />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Change Book Name"), {
      target: { value: "test2" },
    });
    fireEvent.click(screen.getByText("Update Book"));
    //assertions
    waitFor(() => screen.getByText("Error: Server error")).then(() => {
      expect(screen.getByText("Error: Server error")).toBeVisible();
    });
  });

  //successful update
  test('Testing the component when everything is correct it should shows "Book successfully updated"', () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditBook book={book} />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Change Book Name"), {
      target: { value: "test2" },
    });
    fireEvent.click(screen.getByText("Update Book"));
    //assertions
    waitFor(() => screen.getByText("Book successfully updated")).then(() => {
      expect(screen.getByText("Book successfully updated")).toBeVisible();
    });
  });
});
