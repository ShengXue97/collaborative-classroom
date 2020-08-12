import React, { useState, useEffect } from "react";
import ConversationSearch from "../ConversationSearch/ConversationSearch.js";
import ConversationListItem from "../ConversationListItem/ConversationListItem.js";
import Toolbar from "../Toolbar/Toolbar.js";
import ToolbarButton from "../ToolbarButton/ToolbarButton.js";

import "./ConversationList.css";
import Spinner from "react-bootstrap/Spinner";

export default function ConversationList(props) {
  var content =
    props.init == 0 ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Spinner animation="border" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    ) : (
      props.conversations.map(conversation => (
        <ConversationListItem
          updateSmallMessagesFiltered={props.updateSmallMessagesFiltered}
          selectConversation={props.selectConversation}
          key={conversation.name}
          data={conversation}
          unreadNumber={conversation.unreadNumber}
        />
      ))
    );
  return (
    <div className="conversation-list">
      <Toolbar
        title="Messenger"
        leftItems={[<ToolbarButton key="cog" icon="ion-ios-cog" />]}
        rightItems={[
          <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />,
        ]}
      />
      <ConversationSearch />
      {content}
    </div>
  );
}
