import React from "react";
import "./Compose.css";
import socket from "../../../websocket";

export default function Compose(props) {
  const sendMessage = (message, inputBox) => {
    const id = -1;
    const author = localStorage.getItem("user");
    const recipent = "a@a.com";
    const minTimestamp = new Date().getTime();
    const groupname = "none";

    const newMessage = {
      id: id,
      author: author,
      message: message,
      recipent: recipent,
      message: message,
      timestamp: minTimestamp,
      groupname: groupname,
    };

    // props.addMessage(newMessage);

    fetch(
      "http://localhost:5000/sendmessage?author=" +
        author +
        "&recipent=" +
        recipent +
        "&message=" +
        message +
        "&groupname=" +
        groupname,
      {
        method: "GET",
      },
    )
      .then(response => {
        console.log(response);
      })
      .then(data => {
        const user = localStorage.getItem("user");
        const timestamp = new Date().getTime();
        socket.emit(
          "publishMessage",
          id,
          author,
          recipent,
          message,
          minTimestamp,
          groupname,
        );

        props.addMessage(newMessage);
        inputBox.value = "";
      });
  };

  const handleSend = event => {
    if (event.key === "Enter") {
      sendMessage(event.target.value, event.target);
    }
  };

  return (
    <div className="compose">
      <input
        type="text"
        onKeyDown={handleSend}
        className="compose-input"
        placeholder="Type a message, @name"
      />

      {props.rightItems}
    </div>
  );
}
