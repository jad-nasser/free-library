//importing modules
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import SignUp from "./SignUp";

//mocking scrollIntoView()
window.HTMLElement.prototype.scrollIntoView = () => {};

//creating a mock server
const server = setupServer(
  rest.post(
    process.env.REACT_APP_BASE_URL + "/publishers/create-publisher",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    process.env.REACT_APP_BASE_URL + "/publishers/check-login",
    (req, res, ctx) => {
      return res(ctx.status(404), ctx.json("No token found"));
    }
  )
);

before(() => server.listen());
beforeEach(() => server.resetHandlers());
after(() => server.close());

describe("Testing SignUp component", () => {
  //with empty inputs
  test("Testing the component without filling any input", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText("Enter your first name")).toBeVisible();
    expect(screen.getByText("Enter your last name")).toBeVisible();
    expect(screen.getByText("Enter your email")).toBeVisible();
    expect(screen.getByText("Enter your password")).toBeVisible();
    expect(screen.getByText("Confirm your password")).toBeVisible();
  });

  //when typing a not valid password
  test('Testing the component when inserting an invalid password it should shows a text that contains "Password should"', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "blablabla" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText(/Password should/)).toBeVisible();
  });

  //when inserting password confirmation that is not equal to the new password
  test('Testing the component when inserting a password confirmation that is not equal to the new password it should shows "Confirm your password"', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Q3!wasdf" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText("Confirm your password")).toBeVisible();
  });

  //when typing a not valid email
  test('Testing the component when inserting an invalid email it should shows "Enter a valid email"', () => {
    //rendering the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );
    //entering the new email
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "blablabla" },
    });
    //clicking "Chang Email" button
    fireEvent.click(screen.getByText("Sign Up"));
    //assertions
    expect(screen.getByText("Enter a valid email")).toBeVisible();
  });

  //when server sends an error
  test("Testing the component when the server send an error it should display the error", () => {
    //making the mock server sends an error
    server.use(
      rest.post(
        process.env.REACT_APP_BASE_URL + "/publishers/create-publisher",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "testtest@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    waitFor(() => screen.getByText("Error: Server error")).then(() => {
      expect(screen.getByText("Error: Server error")).toBeVisible();
    });
  });

  //successfull update
  test('Testing the component when everything is correct it should shows "Account successfully created"', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "testtest@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    waitFor(() => screen.getByText("Account successfully created")).then(() => {
      expect(screen.getByText("Account successfully created")).toBeVisible();
    });
  });
});
