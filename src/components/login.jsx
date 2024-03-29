import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/login";
import Cookies from "js-cookie";
import { AuthContext } from "../utils/authContext";

const Login = () => {
  const navigate = useNavigate();
  const { username, setUsername } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { setUni } = useContext(AuthContext);
  const [password, setPassword] = useState(null);
  const [alert, setAlert] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login({ username, password });
    if (result.status === 200) {
      setLoading(false);
      Cookies.set("tokenConnect", result.data.token, { expires: 1 });
      setUni(result.data.uni);
      navigate("/newsfeed");
    } else if (result.status === 401) {
      setLoading(false);
      setAlert(true);
      setPassword("");
      setUsername("");
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    }
  };

  return (
    <div class="flex max-h-screen h-full">
      <img class="w-[50%]" src={"/social.jpeg"} alt="Example" />
      <div className="flex flex-col items-center justify-center bg-slate-50 h-full w-full">
        {alert ? (
          <div
            class="transition-opacity duration-500 ease-in-out opacity-100 bg-red-100 border-t-4 border-red-500 rounded-lg text-red-900 px-4 py-3 shadow-md mb-1.5 w-[40%] h-[8%]"
            role="alert"
          >
            <div class="flex">
              <div class="py-1 ">
                <svg
                  class="fill-current h-6 w-6 text-red-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p class="font-bold">Invalid username or password</p>
                <p class="text-sm">Please try to login again</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="opacity-0 h-[8%]  mb-1.5" />
        )}
        <div className="flex flex-col bg-white justify-center items-start rounded-lg shadow-lg h-[40%] w-[45%] mb-24">
          {/*<h1 className='flex h-[20%] justify-start font-roboto text-blue-500 font-medium text-5xl mt-10 ml-10'>Login</h1>*/}
          {/* <div className='flex w-full justify-center'> */}
          {/* <img className='mt-10' src="logo.png" alt="FP logo" width="200" height="150"/> */}
          {/* </div> */}
          <form
            className="flex flex-col justify-center w-full h-full p-10"
            onSubmit={onSubmitHandler}
          >
            <div className="flex flex-col mb-3">
              <div className="flex mb-2">
                <img src="/logov3.png" alt="logo" width="30" />
              </div>
              <label
                htmlFor="username"
                className="h-6 font-medium text-gray-700 text-2xl pt-0.5 mr-2 mb-4 pl-0.5"
              >
                Username
              </label>
              <input
                type="username"
                id="username"
                value={username}
                className="text-gray-700 text-2xl pt-0.5 border-2 rounded-md w-full border-gray-600 pl-2"
                onChange={({ target }) => setUsername(target.value)}
                required
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="password"
                class="h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                class="text-gray-700 text-2xl pt-0.5 border-2 rounded-md w-full border-gray-600 pl-2"
                onChange={({ target }) => setPassword(target.value)}
                placeholder="•••••••••"
                required
              />
            </div>

            <div className="flex justify-between">
              <a className="pl-1 font-roboto underline" href="/signup">
                Sign Up?
              </a>

              {loading ? (
                <button
                  disabled
                  type="submit"
                  className="bg-[#ff9f4b] text-white font-bold py-1 px-2 h-9 w-24 rounded flex items-center space-x-1"
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
                  className="bg-[#eb580a]  hover:bg-[#ff9f4b] text-white font-bold py-1 px-4 h-9 rounded w-24"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
