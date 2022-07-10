//importing modules
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import AddBook from "./AddBook";
//importing test file
import bookFile from "../../test1.pdf";

//mocking scrollIntoView()
window.HTMLElement.prototype.scrollIntoView = () => {};

//creating a mock server
const server = setupServer(
  rest.post(
    process.env.REACT_APP_BASE_URL + "/books/create-book",
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

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Testing AddBook component", () => {
  //with empty inputs
  test("Testing the component without inserting any input", () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AddBook />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Add Book"));
    expect(screen.getByText("Enter book name")).toBeVisible();
    expect(screen.getByText("Enter author name")).toBeVisible();
    expect(screen.getByText("Select book file")).toBeVisible();
  });

  //when server sends an error
  test("Testing the component when the server send an error it should display the error", () => {
    //making the mock server sends an error
    server.use(
      rest.post(
        process.env.REACT_APP_BASE_URL + "/books/create-book",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AddBook />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Book Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Author Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByTestId("book-file-input"), {
      target: { file: bookFile },
    });
    fireEvent.click(screen.getByText("Add Book"));
    //assertions
    waitFor(() => screen.getByText("Error: Server error")).then(() => {
      expect(screen.getByText("Error: Server error")).toBeVisible();
    });
  });

  //successful create
  test('Testing the component when everything is correct it should shows "Book successfully added"', () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AddBook />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Book Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Author Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByTestId("book-file-input"), {
      target: { required: false, file: bookFile },
    });
    fireEvent.click(screen.getByText("Add Book"));
    //assertions
    waitFor(() => screen.getByText("Book successfully added")).then(() => {
      expect(screen.getByText("Book successfully added")).toBeVisible();
    });
  });
});
