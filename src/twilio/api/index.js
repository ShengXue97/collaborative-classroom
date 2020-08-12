import axios from "axios";
import weburl from "../../weburl";

export const getToken = async user =>
  axios.get(weburl + "/token", {
    params: {
      user,
    },
  });
