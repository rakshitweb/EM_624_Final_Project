import axios from "axios";

const BASE_URL = "http://localhost:8080/";

export const request = async (url, query = {}, body = null, method = "GET") => {
  const URL = BASE_URL + url;

  const response = await axios({
    method,
    headers: {
      "Content-Type": "application/json",
    },
    url: URL,
    params: query,
    data: body,
  });

  return response;
};
