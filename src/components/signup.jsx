import React, { useState, useEffect } from "react";
import api from "../services/api";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function SignupForm() {
  // Setup all user-typed fields
  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
    degree: "",
    degreeLevel: "",
    international: false,
    startYear: "",
    endYear: "",
    interests: [],
  });

  // Setup errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Setup states for fetching degrees and degreelevels
  const [degrees, setDegrees] = useState([]);
  const [degreeLevels, setDegreeLevels] = useState([]);
  const [interests, setInterests] = useState([]);

  // Setup dates
  const currentYear = new Date().getFullYear();
  // 10 years ago to this year
  const startYears = Array.from(
    { length: 11 },
    (val, index) => currentYear - 10 + index
  );
  // This year to 10 years after
  const endYears = Array.from(
    { length: 11 },
    (val, index) => currentYear + index
  );

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch degrees
    const fetchDegrees = async () => {
      try {
        const response = await api.get("/credentials/signup/degrees");
        setDegrees(response.data.degrees);
      } catch (error) {
        console.error("Error fetching degrees:", error);
      }
    };

    // Fetch degree levels
    const fetchDegreeLevels = async () => {
      try {
        const response = await api.get("/credentials/signup/degreelevels");
        setDegreeLevels(response.data.degreeLevels);
      } catch (error) {
        console.error("Error fetching degree levels:", error);
      }
    };

    // Fetch interests
    const fetchInterests = async () => {
      try {
        const response = await api.get("/credentials/signup/interests");
        setInterests(response.data.interests);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchDegrees();
    fetchDegreeLevels();
    fetchInterests();

    // setInterests([{interestid: "haha", interestname:"boo"},{interestid: "haha", interestname:"boo"},{interestid: "haha", interestname:"boo"},{interestid: "haha", interestname:"boo"},{interestid: "haha", interestname:"boo"}]);
  }, []); // Empty dependency array means this effect runs once on mount

  // Handle changes to form
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox" && name === "interests") {
      setUser((prevUser) => ({
        ...prevUser,
        interests: checked
          ? [...prevUser.interests, value]
          : prevUser.interests.filter((interestId) => interestId !== value),
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Form validation
  const validate = (user) => {
    let errors = {};

    // Every field (except international cannot be empty)
    // Check if any field in the user object is empty
    Object.keys(user).forEach((key) => {
      if (typeof user[key] === "string") {
        // Trim the value to check for spaces only entries as well
        if (!user[key].trim()) {
          errors[key] = "Field cannot be empty";
        }
      }
    });

    if (!errors) {
      // University Email: Checks that has an @ followed by a dot
      if (!/\S+@\S+\.\S+/.test(user.email))
        errors.email = "Email address is invalid";

      // Password: Must meet min requirements
      if (user.password.length < 8)
        errors.password = "Password must be 8 characters or more";
      if (user.password !== user.rePassword)
        errors.rePassword = "Passwords must match";
    }

    return errors;
  };

  // Setup submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(user);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await api.post("/credentials/signup/signup", user);
        Cookies.set("tokenConnect", response.data, { expires: 1 });
        navigate("/newsfeed");
      } catch (error) {
        console.log(error.response);
        if (error.response && error.response.data.errors) {
          // Directly set the errors object from the backend to the state
          console.log(error.response.data.errors);
          setErrors(error.response.data.errors);
        } else {
          console.error("There was an error signing up:", error);
        }
      }
    }
  };

  // Render form
  return (
    <div class="flex max-h-screen">
      <img class="w-[50%]" src={"/social.jpeg"} alt="Example" />
      <div className="flex items-center justify-center bg-slate-50 h-screen w-[50%]">
        <div className="flex flex-col  justify-start items-center  h-full w-[80%] py-5 max-h-screen">
          <div className="flex flex-col items-start justify-start w-full space-y-2">
            <img src="/logov3.png" alt="logo" width="30" />
            <span className="font-semibold text-3xl mb-1">Sign Up</span>
          </div>
          <div class="my-3 border-2 border-t border-orange-600  w-full shadow-2xl overflow-y-auto"></div>

          <form onSubmit={handleSubmit} class="w-[100%] h-[82%]">
            <div class="ml-8 grid grid-rows-9 grid-cols-6 grid-flow-row w-full h-full">
              <div className="row-span-1 col-span-3 h-6 flex flex-col">
                <label
                  for="username"
                  class="h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5"
                >
                  Username:
                </label>
                <input
                  type="text"
                  class=" text-gray-700 text-xl pt-0.5 border-2 rounded-md w-[80%] border-gray-600 pl-2"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder=""
                />
                {errors.username && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.username}
                  </p>
                )}
              </div>
              <div className="row-span-1 col-span-3 h-6 flex flex-col">
                <label
                  for="email"
                  class="row-span-2 col-span-1 h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5 pr-5"
                >
                  School Email:
                </label>

                <input
                  type="text"
                  class=" text-gray-700 text-xl pt-0.5 border-2 rounded-md w-[80%] border-gray-600 pl-2"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder=""
                />
                {errors.email && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="row-span-1 col-span-3 h-6 flex flex-col">
                <label
                  for="firstName"
                  class="row-span-1 col-span-1 h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5 pr-5"
                >
                  First Name:
                </label>

                <input
                  type="text"
                  class=" text-gray-700 text-xl pt-0.5 border-2 rounded-md w-[80%] border-gray-600 pl-2"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  placeholder=""
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="row-span-1 col-span-3 h-6 flex flex-col">
                <label
                  for="lastName"
                  class="row-span-1 col-span-1 h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5 pr-5"
                >
                  Last Name:
                </label>

                <input
                  type="text"
                  class=" text-gray-700 text-xl pt-0.5 border-2 rounded-md w-[80%] border-gray-600 pl-2"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  placeholder=""
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div className="row-span-1 col-span-3 h-6 flex flex-col">
                <label
                  for="password"
                  class="row-span-1 col-span-1 h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5 pr-5"
                >
                  Password:
                </label>

                <input
                  type="password"
                  class=" text-gray-700 text-xl pt-0.5 border-2 rounded-md w-[80%] border-gray-600 pl-2"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder=""
                />
                {errors.password && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="row-span-1 col-span-3 h-6 flex flex-col">
                <label
                  for="rePassword"
                  class="row-span-1 col-span-1 h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5 pr-5"
                >
                  Re-type password:
                </label>

                <input
                  type="password"
                  class=" text-gray-700 text-xl pt-0.5 border-2 rounded-md w-[80%] border-gray-600 pl-2"
                  name="rePassword"
                  value={user.rePassword}
                  onChange={handleChange}
                  placeholder=""
                />
                {errors.rePassword && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.rePassword}
                  </p>
                )}
              </div>
              <div className="row-span-2 col-span-4 h-6 flex flex-col">
                <label
                  for="degree"
                  class="h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5 pr-5"
                >
                  Degree:
                </label>
                <div className="row-span-2 col-span-3 h-6">
                  <select
                    className="text-gray-700 text-lg pt-0.5 border-2 w-[90%] border-gray-600 rounded-md pl-2"
                    value={user.degree}
                    onChange={handleChange}
                    name="degree"
                    size="4"
                  >
                    {/* <option value="" disabled>
                                        Select a degree
                                    </option> */}

                    {degrees.map((degree) => (
                      // <option key={degree.degreeid} value={degree.degreeid}>
                      //     {degree.degreename}
                      // </option>
                      <option key={degree.degreeid} value={degree.degreeid}>
                        {degree.degreename}
                      </option>
                    ))}
                    {/* <option value="Merceders"> Merceders </option>  
                                    <option value="BMW"> BMW </option>  
                                    <option value="Jaguar"> Jaguar </option>  
                                    <option value="Lamborghini"> Lamborgfdsafdsafahini </option>  
                                    <option value="Ferrari"> Ferrari </option>  
                                    <option value="Ford"> Ford </option>   */}
                  </select>
                  {errors.degree && (
                    <p className="text-red-600 text-sm font-semibold">
                      {errors.degree}
                    </p>
                  )}
                </div>
              </div>
              <div className="row-span-2 col-span-2 h-6 flex flex-col items-center justify-center">
                <label
                  for="internationl"
                  class="text-gray-700 pt-0.5 mr-6 mb-0.5 pr-5 flex mt-32"
                >
                  <input
                    type="checkbox"
                    class="checkbox-round mt-1"
                    name="international"
                    checked={user.international}
                    onChange={handleChange}
                  />
                  <span className="font-medium text-xl ml-5 w-36">
                    International Student
                  </span>
                </label>
              </div>
              <div className="row-span-1 col-span-3 h-6 flex flex-col">
                <label class="flex flex-col w-[90%]">
                  <span className="font-medium text-xl mb-1">Degree Level</span>
                  <select
                    className="text-gray-700 text-xl pt-0.5 border-2  border-gray-600 rounded-md pl-2"
                    value={user.degreeLevel}
                    onChange={handleChange}
                    name="degreeLevel"
                  >
                    <option value="" disabled>
                      Select a degree level
                    </option>
                    {degreeLevels.map((level) => (
                      <option
                        key={level.degreelevelid}
                        value={level.degreelevelid}
                      >
                        {level.degreelevelname}
                      </option>
                    ))}
                  </select>
                </label>
                {errors.degreeLevel && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.degreeLevel}
                  </p>
                )}
              </div>
              <div className="row-span-1 col-span-1 h-6 flex flex-col ml-2">
                <label class="flex flex-col w-28">
                  <span className="font-medium text-xl mb-1">Start Year</span>
                  <select
                    className="text-gray-700 text-xl pt-0.5 border-2  border-gray-600 rounded-md pl-2"
                    value={user.startYear}
                    onChange={handleChange}
                    name="startYear"
                  >
                    <option value="" disabled></option>
                    {startYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
                {errors.startYear && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.startYear}
                  </p>
                )}
              </div>
              <div className="row-span-1 col-span-1 h-6 flex flex-col ml-6">
                <label class="flex flex-col ml-6 w-28">
                  <span className="font-medium text-xl mb-1">End Year</span>
                  <select
                    className="text-gray-700 text-xl pt-0.5 border-2  border-gray-600 rounded-md pl-2"
                    value={user.endYear}
                    onChange={handleChange}
                    name="endYear"
                  >
                    <option value="" disabled></option>
                    {endYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
                {errors.endYear && (
                  <p className="text-red-600 text-sm font-semibold">
                    {errors.endYear}
                  </p>
                )}
              </div>
              <div className="row-span-2 col-span-6 h-48 flex flex-col w-[90%]">
                <label class="font-medium text-xl">Interests</label>
                <div class="border-2 bg-slate-100 rounded-lg pt-5 pl-12 mt-2 grid grid-rows-2 grid-cols-3 grid-flow-row gap-4 h-[100%]">
                  {interests.map((interest) => (
                    <div key={interest.interestid}>
                      <label class="flex">
                        <input
                          name="interests"
                          type="checkbox"
                          class="checkbox-round mt-1"
                          value={interest.interestid}
                          checked={user.interests.includes(
                            interest.interestid.toString()
                          )}
                          onChange={handleChange}
                        />
                        <span className="font-medium text-xl ml-5 w-36">
                          {interest.interest}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              {loading ? (
                <button
                  disabled
                  type="submit"
                  className="bg-[#ff9f4b] text-white font-bold py-1 px-4 mr-8 w-28 mt-2 h-9 rounded-md flex items-center space-x-1"
                >
                  <span>Loading </span>
                  <svg
                    aria-hidden="true"
                    class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-[#eb580a]  hover:bg-[#ff9f4b] text-white font-bold py-1 px-4 mr-8 w-28 mt-2 h-9 rounded-md"
                >
                  Sign Up
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
