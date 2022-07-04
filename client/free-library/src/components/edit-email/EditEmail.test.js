//importing modules
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import EditEmail from "./EditEmail";

//mocking scrollIntoView()
window.HTMLElement.prototype.scrollIntoView = () => {};

//creating a mock server
const server = setupServer(
  rest.patch(
    process.env.REACT_APP_BASE_URL + "/publishers/update-publisher",
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

describe("Testing EditEmail component", () => {
  //with empty inputs
  test('Testing the component without inserting a new email it should shows "Enter new email"', () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditEmail />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Change Email"));
    expect(screen.getByText("Enter new email")).toBeVisible();
  });

  //when typing a not valid email
  test('Testing the component when inserting an invalid email it should shows "Enter a valid email"', () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditEmail />
        </BrowserRouter>
      </Provider>
    );
    //entering the new email
    fireEvent.change(screen.getByPlaceholderText("New Email"), {
      target: { value: "blablabla" },
    });
    //clicking "Chang Email" button
    fireEvent.click(screen.getByText("Change Email"));
    //assertions
    expect(screen.getByText("Enter a valid email")).toBeVisible();
  });

  //when server sends an error
  test("Testing the component when the server send an error it should display the error", () => {
    //making the mock server sends an error
    server.use(
      rest.patch(
        process.env.REACT_APP_BASE_URL + "/publishers/update-publisher",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditEmail />
        </BrowserRouter>
      </Provider>
    );
    //entering the new email
    fireEvent.change(screen.getByPlaceholderText("New Email"), {
      target: { value: "testtest@email.com" },
    });
    //clicking "Chang Email" button
    fireEvent.click(screen.getByText("Change Email"));
    //assertions
    waitFor(() => screen.getByText("Error: Server error")).then(() => {
      expect(screen.getByText("Error: Server error")).toBeVisible();
    });
  });

  //successful update
  test('Testing the component when everything is correct it should shows "Email successfully changed"', () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditEmail />
        </BrowserRouter>
      </Provider>
    );
    //entering the new email
    fireEvent.change(screen.getByPlaceholderText("New Email"), {
      target: { value: "testtest@email.com" },
    });
    //clicking "Chang Email" button
    fireEvent.click(screen.getByText("Change Email"));
    //assertions
    waitFor(() => screen.getByText("Email successfully changed")).then(() => {
      expect(screen.getByText("Email successfully changed")).toBeVisible();
    });
  });
});
