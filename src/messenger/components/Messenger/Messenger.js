import React, { useEffect } from "react";
import ConversationList from "../ConversationList/ConversationList.js";
import MessageList from "../MessageList/MessageList.js";
import "./Messenger.css";

export default function Messenger(props) {

  return (
    <div className="messenger">
      <div className="scrollable sidebar">
        <ConversationList />
      </div>

      <div className="scrollable content">
        <MessageList/>
      </div>
    </div>
  );
}
