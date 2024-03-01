import api from "./api";
import { getToken } from "../utils/helper";

const login = async (object) => {
  try {
    const response = await api.post("/login", object);
    return { status: response.status, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Redirect to the login page when a 401 error occurs
      return { status: 401, data: error.response.data };
    }
  }
};

const authen = async (object) => {
  try {
    const response = await api.get("/login/authenticate", {
      headers: {
        Authorization: `Bearer ${getToken(document.cookie)}`,
      },
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Redirect to the login page when a 401 error occurs
      return { status: 401, data: error.response.data };
    }
  }
};

export { login, authen };
