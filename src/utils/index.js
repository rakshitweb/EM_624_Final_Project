import axios from "axios";

export const BASE_URL = "https://em-624-final-project.onrender.com/";

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

export function getQueryParam(param) {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(param);
}

export function removeQueryParams() {
  // Remove query parameters from the URL
  const url = window.location.protocol + "//" + window.location.host + window.location.pathname;
  window.history.replaceState({}, "", url);
}