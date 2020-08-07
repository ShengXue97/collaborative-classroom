import React, { useRef, useState, useEffect } from "react";
import ConversationList from "../ConversationList/ConversationList.js";
import MessageList from "../MessageList/MessageList.js";
import "./Messenger.css";
import axios from "axios";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Messenger(props) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState([]);
  const conversationsRef = useRef([]);

  useEffect(() => {
    getAvatars();
  }, []);

  useInterval(() => {
    setConversations(JSON.parse(JSON.stringify(conversationsRef.current)));
  }, 1000);

  const updateConversation = message => {
    //IMPORTANT: State is not kept inside here(socket.on), only Ref.
    const isNew = message.isNew;
    const otherParty = message.otherParty;
    if (isNew) {
      axios.get("https://randomuser.me/api/?results=1").then(response => {
        const photo = response.data.results[0].picture.large;
        const name = otherParty;
        const text = message.message;
        conversationsRef.current.push({
          photo: photo,
          name: name,
          text: text,
        });
        console.log(conversations);
      });
    } else {
      let firstConversation = {};
      let newConversations = conversationsRef.current.filter((element, index) => {
        if (element.name != otherParty) {
          return true;
        } else {
          firstConversation = {
            photo: element.photo,
            name: element.name,
            text: message.message,
          };
          return false;
        }
      });

      newConversations.unshift(firstConversation);

      conversationsRef.current = newConversations;
    }
  };

  const selectConversation = selectedUser => {
    setActiveConversation(selectedUser);
    setFilteredMessages(messages[selectedUser]);
  };

  const getAvatars = () => {
    axios.get("https://randomuser.me/api/?results=20").then(response => {
      let newAvatars = response.data.results.map(result => {
        return result.picture.large;
      });
      getConversations(newAvatars);
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
        conversationsRef.current = Object.values(newConversations);
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
          updateConversation={updateConversation}
          activeConversation={activeConversation}
          filteredMessages={filteredMessages}
          fullMessages={messages}
        />
      </div>
    </div>
  );
}
