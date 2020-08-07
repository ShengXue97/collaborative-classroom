import React, { useState, useEffect } from "react";
import ConversationSearch from "../ConversationSearch/ConversationSearch.js";
import ConversationListItem from "../ConversationListItem/ConversationListItem.js";
import Toolbar from "../Toolbar/Toolbar.js";
import ToolbarButton from "../ToolbarButton/ToolbarButton.js";
import axios from "axios";

import "./ConversationList.css";

export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    getAvatars();
  }, []);

  const getAvatars = () => {
    axios.get("https://randomuser.me/api/?results=20").then(response => {
      let avatars = response.data.results.map(result => {
        return result.picture.large;
      });
      getConversations(avatars);
    });
  };

  const getConversations = avatars => {
    var newMessages = {};
    var newConversations = {};

    const user = localStorage.getItem("user");
    const minTimestamp = 0;
    var count = 0;

    fetch(
      "http://localhost:5000/singlechat?recipent=" +
        user +
        "&minTimestamp=" +
        minTimestamp,
      {
        method: "GET",
      },
    )
      .then(response => {
        return response.text();
      })
      .then(data => {
        const dataParsed = JSON.parse(data);
        console.log(dataParsed);
        dataParsed.map((element, index) => {
          var otherParty = "";

          if (element.author == user) {
            otherParty = element.recipent;
          } else if (element.recipent == user) {
            otherParty = element.author;
          }

          if (otherParty != "") {
            if (otherParty in newMessages) {
              newMessages[otherParty].push(element);
              newConversations[otherParty] = {
                photo: newConversations[otherParty].photo,
                name: otherParty,
                text: element.message,
              };
            } else {
              newMessages[otherParty] = [element];
              newConversations[otherParty] = {
                photo: avatars[count],
                name: otherParty,
                text: element.message,
              };
              count = count + 1;
            }
          }
        });

        //Map to required format for parsing
        console.log(newMessages);
        console.log(Object.values(newConversations));
        setConversations(Object.values(newConversations));
      });
  };

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
      {conversations.map(conversation => (
        <ConversationListItem key={conversation.name} data={conversation} />
      ))}
    </div>
  );
}
