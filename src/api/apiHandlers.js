const API_URL = "http://localhost:80/api/v1"; // Replace with env variable

const defaultOptions = ({ headers, options }) => ({
  headers: {
    "Content-type": "application/json",
    Authorization: `JWT ${123}`, // Add JWT token here; // If Using Cookies for session authentication you can remove this and add "Cookie" header
    ...headers,
  },
  ...options,
});

export const apiGet = async ({ path, headers: {}, options: {} }) => {
  return fetch(API_URL + path, defaultOptions(headers, options))
    .then((raw) => raw.json())
    .then((res) => {
      // TODO: Add logic to handle API errors

      return res;
    })
    .catch((err) => {
      // If this fails you need to handle it
    });
};

export const apiPost = async ({ path, body: {}, headers: {}, options: {} }) => {
  const reqOptions = defaultOptions({
    headers,
    options: {
      method: "POST",
      body: body,
      ...options,
    },
  });

  return fetch(API_URL + path, reqOptions)
    .then((raw) => raw.json())
    .then((res) => {
      // TODO: Add logic to handle API errors

      return res;
    })
    .catch((err) => {
      // If this fails you need to handle it
    });
};

export const apiPut = async ({ path, body: {}, headers: {}, options: {} }) => {
  const reqOptions = defaultOptions({
    headers,
    options: {
      method: "PUT",
      body: body,
      ...options,
    },
  });

  return fetch(API_URL + path, reqOptions)
    .then((raw) => raw.json())
    .then((res) => {
      // TODO: Add logic to handle API errors

      return res;
    })
    .catch((err) => {
      // If this fails you need to handle it
    });
};

export const apiDelete = async ({ path, body: {}, headers: {}, options: {} }) => {
  const reqOptions = defaultOptions({
    headers,
    options: {
      method: "DELETE",
      body: body,
      ...options,
    },
  });

  return fetch(API_URL + path, reqOptions)
    .then((raw) => raw.json())
    .then((res) => {
      // TODO: Add logic to handle API errors

      return res;
    })
    .catch((err) => {
      // If this fails you need to handle it
    });
};
