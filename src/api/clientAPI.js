import { apiGet } from "./apiHandlers";

// Example file with requests to the Client API
// Make one file for each service that this app is accessing

const CLIENT_API_ROUTE = "/client";

export const getClient = async () => {
  const client = await apiGet({ path: `${CLIENT_API_ROUTE}/` });

  return client;
};
