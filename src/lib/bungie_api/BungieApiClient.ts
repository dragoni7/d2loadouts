import axios from "axios";

const BASE_URL = "https://www.bungie.net";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-API-Key": import.meta.env.VITE_API_KEY,
  },
});

/**
 * Bungie get request
 * @param url
 * @param config axios config
 * @returns
 */
const _get = (url: string, config = {}) => {
  return apiClient.get(url, config);
};

/**
 * Bungie post request
 * @param url
 * @param data request body
 * @param config axios config
 * @returns
 */
const _post = (url: string, data = {}, config = {}) => {
  return apiClient.post(url, data, config);
};

export { _get, _post };
