import React from "react";
import ComposeConversation from "../ComposeConversation/ComposeConversation";
import "./ConversationSearch.css";

export default function ConversationSearch() {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 1 }} className="conversation-search">
        <input
          type="search"
          className="conversation-search-input"
          placeholder="Search Messages"
        />
      </div>
      <div style={{ flex: 1 }}>
        <ComposeConversation />
      </div>
    </div>
  );
}
