//importing modules
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import EditName from "./EditName";

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

describe("Testing EditName component", () => {
  //with empty inputs
  test("Testing the component without filling any input", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditName />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Change Name"));
    expect(screen.getByText("Enter new first name")).toBeVisible();
    expect(screen.getByText("Enter new last name")).toBeVisible();
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
          <EditName />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("New First Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Last Name"), {
      target: { value: "test" },
    });
    fireEvent.click(screen.getByText("Change Name"));
    waitFor(() => screen.getByText("Error: Server error")).then(() => {
      expect(screen.getByText("Error: Server error")).toBeVisible();
    });
  });

  //successfull update
  test('Testing the component when everything is correct it should shows "Name successfully changed"', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EditName />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("New First Name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("New First Name"), {
      target: { value: "test" },
    });
    fireEvent.click(screen.getByText("Change Name"));
    waitFor(() => screen.getByText("Name successfully changed")).then(() => {
      expect(screen.getByText("Name successfully changed")).toBeVisible();
    });
  });
});
