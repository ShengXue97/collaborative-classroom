import io from "socket.io-client";
import weburl from "./weburl";
let socket = io(weburl + "/");
export default socket;
