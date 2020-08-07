import React from "react";
import NewConversation from "../NewConversation/NewConversation";
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
        <NewConversation />
      </div>
    </div>
  );
}
