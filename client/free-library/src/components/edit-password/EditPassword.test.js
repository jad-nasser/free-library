//importing modules
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import EditPassword from "./EditPassword";

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

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Testing EditPassword component", () => {
  //with empty inputs
  test("Testing the component without filling any input", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditPassword />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Change Password"));
    expect(screen.getByText("Enter new password")).toBeVisible();
    expect(screen.getByText("Enter old password")).toBeVisible();
    expect(screen.getByText("Confirm your password")).toBeVisible();
  });

  //when typing a not valid password
  test('Testing the component when inserting an invalid password it should shows a text that contains "Password should"', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditPassword />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "blablabla" },
    });
    fireEvent.click(screen.getByText("Change Password"));
    expect(screen.getByText(/Password should/)).toBeVisible();
  });

  //when inserting password confirmation that is not equal to the new password
  test('Testing the component when inserting a password confirmation that is not equal to the new password it should shows "Confirm your password"', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditPassword />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Q3!wasdf" },
    });
    fireEvent.click(screen.getByText("Change Password"));
    expect(screen.getByText("Confirm your password")).toBeVisible();
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

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditPassword />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Old Password"), {
      target: { value: "Q2!wasdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.click(screen.getByText("Change Password"));
    waitFor(() => screen.getByText("Error: Server error")).then(() => {
      expect(screen.getByText("Error: Server error")).toBeVisible();
    });
  });

  //successfull update
  test('Testing the component when everything is correct it should shows "Password successfully changed"', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditPassword />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Old Password"), {
      target: { value: "Q2!wasdf" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Q1!wasdf" },
    });
    fireEvent.click(screen.getByText("Change Password"));
    waitFor(() => screen.getByText("Password successfully changed")).then(
      () => {
        expect(screen.getByText("Password successfully changed")).toBeVisible();
      }
    );
  });
});
