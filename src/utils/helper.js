import { authen } from "../services/login.jsx";

const getToken = (cookies) => {
  const cookieObject = Object.fromEntries(
    cookies.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, value];
    })
  );
  return cookieObject.tokenConnect;
};

const authenticate = async (cookies) => {
  if (getToken(cookies) === undefined) {
    return undefined;
  } else {
    const result = await authen({ token: getToken(cookies) });
    return result.data;
  }
};

export { getToken, authenticate };
