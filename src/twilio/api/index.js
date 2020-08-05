import axios from "axios";

export const getToken = async user =>
  axios.get("https://collaborative-classroom-server.herokuapp.com/token", {
    params: {
      user
    }
  });
