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
  ),
  rest.get(
    process.env.REACT_APP_BASE_URL + "/books/get-books",
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          books: [
            {
              book_name: "test",
              author: "test",
              file_path: "blabla.pdf",
              id: 10,
              number_of_downloads: 1111,
            },
          ],
        })
      )
  )
);

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Testing EditBook component", () => {
  //with empty inputs
  test("Testing the component without inserting any input, the 'Edit Book' button should be disabled", () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditBook />
        </BrowserRouter>
      </Provider>
    );
    waitFor(() => screen.getByText("Edit Book")).then(() =>
      expect(screen.getByText("Edit Book")).toBeDisabled()
    );
  });

  //when clicking 'Delete Book'
  test("Testing the component when clicking the 'Delete Book' and then select 'Yes' it should shows 'Book successfully deleted'", () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditBook />
        </BrowserRouter>
      </Provider>
    );
    waitFor(() => screen.getByText("Delete Book"))
      //clicking the buttons to delete the book
      .then(() => {
        fireEvent.click(screen.getByText("Delete Book"));
        fireEvent.click(screen.getByText("Yes"));
      })
      //assertions
      .then(() => waitFor(() => screen.getByText("Book successfully deleted")))
      .then(() => {
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
          <EditBook />
        </BrowserRouter>
      </Provider>
    );
    //filling the inputs
    waitFor(() => screen.getByPlaceholderText("Change Book Name"))
      .then(() => {
        fireEvent.change(screen.getByPlaceholderText("Change Book Name"), {
          target: { value: "test2" },
        });
        fireEvent.click(screen.getByText("Edit Book"));
      })
      //assertions
      .then(() => waitFor(() => screen.getByText("Error: Server error")))
      .then(() => {
        expect(screen.getByText("Error: Server error")).toBeVisible();
      });
  });

  //successful update
  test('Testing the component when everything is correct it should shows "Book successfully updated"', () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditBook />
        </BrowserRouter>
      </Provider>
    );
    //filling the inputs
    waitFor(() => screen.getByPlaceholderText("Change Book Name"))
      .then(() => {
        fireEvent.change(screen.getByPlaceholderText("Change Book Name"), {
          target: { value: "test2" },
        });
        fireEvent.click(screen.getByText("Edit Book"));
      })
      //assertions
      .then(() => waitFor(() => screen.getByText("Book successfully updated")))
      .then(() => {
        expect(screen.getByText("Book successfully updated")).toBeVisible();
      });
  });
});
