import React, { useState, useEffect } from "react";
import ConversationSearch from "../ConversationSearch/ConversationSearch.js";
import ConversationListItem from "../ConversationListItem/ConversationListItem.js";
import Toolbar from "../Toolbar/Toolbar.js";
import ToolbarButton from "../ToolbarButton/ToolbarButton.js";
import axios from "axios";

import "./ConversationList.css";

export default function ConversationList(props) {
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
      {props.conversations.map(conversation => (
        <ConversationListItem
          selectConversation={props.selectConversation}
          key={conversation.name}
          data={conversation}
        />
      ))}
    </div>
  );
}
