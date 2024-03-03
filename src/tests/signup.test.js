import React from "react";
import { render, screen, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import SignupForm from "../components/signup";
import { ProvideAuth } from "../utils/authContext";
import api from "../services/api";

jest.mock("../services/api");

describe("<SignUpForm>", () => {
  it("should render skelenton of page", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/credentials/signup/degreelevels") {
        return Promise.resolve({
          data: {
            degreeLevels: [{ degreelevelid: 1, degreelevelname: "Bachelor" }],
          },
        });
      } else if (url === "/credentials/signup/degrees") {
        return Promise.resolve({
          data: { degrees: [{ degreeid: 1, degreename: "ABC" }] },
        });
      } else if (url === "/credentials/signup/interests") {
        return Promise.resolve({
          data: {
            interests: [
              { interestid: 1, interest: "Flatmate", url: "/house.jpeg" },
              {
                interestid: 2,
                interest: "Group project",
                url: "/project.jpeg",
              },
              {
                interestid: 3,
                interest: "Internship",
                url: "/internship.jpeg",
              },
              { interestid: 4, interest: "Study group", url: "/study.jpeg" },
              {
                interestid: 5,
                interest: "Competition",
                url: "/competition.jpeg",
              },
            ],
          },
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <ProvideAuth>
          <Router>
            <SignupForm />
          </Router>
        </ProvideAuth>
      );
    });

    await expect(screen.getByText("Username:")).toBeInTheDocument();
    await expect(screen.getByText("Password:")).toBeInTheDocument();
    await expect(screen.getByText("Email:")).toBeInTheDocument();
  });

  it("should render content obtained from backend calls", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/credentials/signup/degreelevels") {
        return Promise.resolve({
          data: {
            degreeLevels: [{ degreelevelid: 1, degreelevelname: "Bachelor" }],
          },
        });
      } else if (url === "/credentials/signup/degrees") {
        return Promise.resolve({
          data: { degrees: [{ degreeid: 1, degreename: "ABC" }] },
        });
      } else if (url === "/credentials/signup/interests") {
        return Promise.resolve({
          data: {
            interests: [
              { interestid: 1, interest: "Flatmate", url: "/house.jpeg" },
              {
                interestid: 2,
                interest: "Group project",
                url: "/project.jpeg",
              },
              {
                interestid: 3,
                interest: "Internship",
                url: "/internship.jpeg",
              },
              { interestid: 4, interest: "Study group", url: "/study.jpeg" },
              {
                interestid: 5,
                interest: "Competition",
                url: "/competition.jpeg",
              },
            ],
          },
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <ProvideAuth>
          <Router>
            <SignupForm />
          </Router>
        </ProvideAuth>
      );
    });

    await expect(screen.getByText("Bachelor")).toBeInTheDocument();
    await expect(screen.getByText("ABC")).toBeInTheDocument();
    await expect(screen.getByText("Competition")).toBeInTheDocument();
  });
});
