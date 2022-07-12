//importing modules
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import DeactivateAccount from "./DeactivateAccount";

//mocking scrollIntoView()
window.HTMLElement.prototype.scrollIntoView = () => {};

//creating a mock server
const server = setupServer(
  rest.delete(
    process.env.REACT_APP_BASE_URL + "/publishers/delete-publisher",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.delete(
    process.env.REACT_APP_BASE_URL + "/publishers/sign-out",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    process.env.REACT_APP_BASE_URL + "/publishers/check-login",
    (req, res, ctx) => {
      return res(ctx.status(200).json(true));
    }
  )
);

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Testing DeactivateAccount component", () => {
  //when server sends an error
  test("Testing the component when the server send an error it should display the error", () => {
    //making the mock server sends an error
    server.use(
      rest.patch(
        process.env.REACT_APP_BASE_URL + "/publishers/delete-publisher",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DeactivateAccount />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Deactivate Account"));
    fireEvent.click(screen.getByText("Yes"));
    waitFor(() => screen.getByText("Error: Server error")).then(() => {
      expect(screen.getByText("Error: Server error")).toBeVisible();
    });
  });

  //successfull deactivation
  test('Testing the component when everything is correct it should shows "Account successfully deactivated"', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DeactivateAccount />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Deactivate Account"));
    fireEvent.click(screen.getByText("Yes"));
    waitFor(() => screen.getByText("Account successfully deactivated")).then(
      () => {
        expect(
          screen.getByText("Account successfully deactivated")
        ).toBeVisible();
      }
    );
  });
});
