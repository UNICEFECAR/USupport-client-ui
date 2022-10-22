import axios from "axios";
import { log } from "./log";

// handle unexpected errors received from the api
axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    log(error);
  }

  return Promise.reject(error);
});

/**
 * sets the jwt token to the request headers
 *
 * @param {string} jwt the jwt token from the local storage
 *
 */
function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

const exportedFunctions = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};

export default exportedFunctions;
