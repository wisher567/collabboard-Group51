import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "./LoginForm";

beforeEach(() => {
  global.fetch = jest.fn();
  window.localStorage.clear();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("LoginForm", () => {
  test("renders email and password inputs", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log in/i })
    ).toBeInTheDocument();
  });

  test("shows an error message when the API returns a failure response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid email or password" }),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@company.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    const errorMessage = await screen.findByText(/invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("calls the login API with the entered email and password on submit", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "fake-jwt-token" }),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane.doe@company.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "correct-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/auth/login");

    const body = JSON.parse(options.body);
    expect(body).toEqual({
      email: "jane.doe@company.com",
      password: "correct-password",
    });

    await waitFor(() => {
      expect(window.localStorage.getItem("token")).toBe("fake-jwt-token");
    });
  });
});