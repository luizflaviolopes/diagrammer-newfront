import axios from "axios";
import { Auth } from "aws-amplify";
import config from "../config.js";

const instance = axios.create({ baseURL: config.apiDomain });

const injectAuth = async (configs) => {
  let conf = configs || {};
  conf.headers = conf.headers || {};

  const user = await Auth.currentSession();
  conf.headers.Authorization = user.getIdToken().jwtToken;

  return conf;
};

const request = async (path, data, config, type) => {
  const confAuth = await injectAuth(config);

  let req;

  switch (type) {
    case "post":
      req = instance.post(path, data, confAuth);
      break;
    case "get":
    default:
      req = instance.get(path, confAuth);
      break;
  }

  const response = await req;

  return response.data;
};

export default {
  post: (path, data, config) => request(path, data, config, "post"),
  get: (path, config) => request(path, null, config, "get"),
};