import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Login from "../components/login";
import { ProvideAuth } from "../utils/authContext";

describe("<Login/>", () => {
  it("should render items", () => {
    render(
      <ProvideAuth>
        <Router>
          <Login />
        </Router>
      </ProvideAuth>
    );

    expect(screen.getByText("Username")).toBeVisible();
    expect(screen.getByText("Password")).toBeVisible();
  });
});
