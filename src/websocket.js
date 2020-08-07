import io from "socket.io-client";
let socket = io("https://collaborative-classroom-server.herokuapp.com/");
export default socket;
