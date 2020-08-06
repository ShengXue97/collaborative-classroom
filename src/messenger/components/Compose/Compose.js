import React from "react";
import "./Compose.css";

export default function Compose(props) {
  const sendMessage = (message, inputBox) => {
    const author = localStorage.getItem("user");
    const recipent = "a@a.com";
    const groupname = "none";
    const minTimestamp = new Date().getTime();

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
        console.log(data);
        props.getMessages(recipent, minTimestamp);
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
