//importing modules
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import SignIn from "./SignIn";

//mocking scrollIntoView()
window.HTMLElement.prototype.scrollIntoView = () => {};

//creating a mock server
const server = setupServer(
  rest.post(
    process.env.REACT_APP_BASE_URL + "/publishers/login",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    process.env.REACT_APP_BASE_URL + "/publishers/check-login",
    (req, res, ctx) => {
      return res(ctx.status(404), ctx.json("Not valid token"));
    }
  )
);

before(() => server.listen());
beforeEach(() => server.resetHandlers());
after(() => server.close());

describe("Testing SignIn component", () => {
  //with empty inputs
  test("Testing the component without filling any input", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Sign In"));
    expect(screen.getByText("Enter Email")).toBeVisible();
    expect(screen.getByText("Enter Password")).toBeVisible();
  });

  //when server sends an error
  test("Testing the component when the server send an error it should display the error", () => {
    //making the mock server sends an error
    server.use(
      rest.post(
        process.env.REACT_APP_BASE_URL + "/publishers/login",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "testtest@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "test" },
    });
    fireEvent.click(screen.getByText("Sign In"));
    waitFor(() => screen.getByText("Error: Server error")).then(() => {
      expect(screen.getByText("Error: Server error")).toBeVisible();
    });
  });
});
