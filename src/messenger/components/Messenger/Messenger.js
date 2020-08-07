import React, { useState, useEffect } from "react";
import ConversationList from "../ConversationList/ConversationList.js";
import MessageList from "../MessageList/MessageList.js";
import "./Messenger.css";
import axios from "axios";

export default function Messenger(props) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState([]);

  useEffect(() => {
    getAvatars();
  }, []);

  const selectConversation = selectedUser => {
    setActiveConversation(selectedUser);
    setFilteredMessages(messages[selectedUser]);
  };

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
        dataParsed.map((element, index) => {
          var otherParty = "";

          if (element.author == user) {
            otherParty = element.recipent;
          } else if (element.recipent == user) {
            otherParty = element.author;
          }

          if (otherParty != "" && otherParty != user) {
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
        setConversations(Object.values(newConversations));

        const keyList = Object.keys(newConversations);
        var filteredMessages = [];
        if (keyList.length > 0) {
          filteredMessages = newMessages[keyList[0]];
          setActiveConversation(keyList[0]);
        }
        console.log(filteredMessages);
        setMessages(newMessages);
        setFilteredMessages(filteredMessages);
      });
  };

  return (
    <div className="messenger">
      <div className="scrollable sidebar">
        <ConversationList
          selectConversation={selectConversation}
          conversations={conversations}
        />
      </div>

      <div className="scrollable content">
        <MessageList
          activeConversation={activeConversation}
          filteredMessages={filteredMessages}
          fullMessages={messages}
        />
      </div>
    </div>
  );
}
