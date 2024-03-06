import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Personal from "../components/personal.jsx";
import { ProvideAuth } from "../utils/authContext";
import "intersection-observer";
import api from "../services/api";

jest.mock("../services/api");

describe("<Personal>", () => {
  it("basic elemnts shold be render", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/api/getlikes") {
        return Promise.resolve({ data: { likes: [{ postid: 1 }] } });
      } else if (url === "/api/enhanced-xposts") {
        return Promise.resolve({
          data: {
            posts: [
              {
                postid: 38,
                userid: "user0001",
                create_timestamp: "2024-02-22T23:20:20.000Z",
                last_update_timestamp: "2024-02-22T23:20:20.000Z",
                interestid: 1,
                header: "stadia",
                description: "I am looking for a housemate",
                visibility: 0,
                active: 1,
                number_of_likes: 0,
                firstname: "John",
                lastname: "Doe",
                universityid: 123,
                university: "Imperial College London",
                interest: "Flatmate",
              },
            ],
          },
        });
      } else if (url === "/api/getTotalMetrics") {
        return Promise.resolve({
          data: {
            likes: { postscount: 7, likescount: 1, commentscount: 22 },
          },
        });
      } else if (url === "/api/interests") {
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
            <Personal />
          </Router>
        </ProvideAuth>
      );
    });

    await expect(screen.getByText("Profile Summary")).toBeVisible();
    // expect(screen.getByText('Password')).toBeVisible()
  });

  

  it("clicking make a post should trigger pop-up", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/api/getlikes") {
        return Promise.resolve({ data: { likes: [{ postid: 1 }] } });
      } else if (url === "/api/enhanced-xposts") {
        return Promise.resolve({
          data: {
            posts: [
              {
                postid: 38,
                userid: "user0001",
                create_timestamp: "2024-02-22T23:20:20.000Z",
                last_update_timestamp: "2024-02-22T23:20:20.000Z",
                interestid: 1,
                header: "stadia",
                description: "I am looking for a housemate",
                visibility: 0,
                active: 1,
                number_of_likes: 0,
                firstname: "John",
                lastname: "Doe",
                universityid: 123,
                university: "Imperial College London",
                interest: "Flatmate",
              },
            ],
          },
        });
      } else if (url === "/api/getTotalMetrics") {
        return Promise.resolve({
          data: {
            likes: { postscount: 7, likescount: 1, commentscount: 22 },
          },
        });
      } else if (url === "/api/interests") {
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
            <Personal />
          </Router>
        </ProvideAuth>
      );
    });

    const buttonElement = screen.getByText("Make a post"); // Replace with your actual button text

    // Simulate a click on the button
    fireEvent.click(buttonElement);
    await expect(screen.getByText("Submit")).toBeVisible();
    // expect(screen.getByText('Password')).toBeVisible()
  });
});
