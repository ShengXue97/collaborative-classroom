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
    const user = localStorage.getItem("user");
    if (isNew) {
      axios.get("https://randomuser.me/api/?results=1").then(response => {
        const photo = response.data.results[0].picture.large;
        const name = otherParty;
        const text = message.message;
        const timestamp = -1;
        var unreadNumber = 1;
        //Only messages where you're the recipent(not the author) should be counted
        //as unread messages
        if (message.author == user) {
          unreadNumber = 0;
        }
        conversationsRef.current.push({
          photo: photo,
          name: name,
          text: text,
          timestamp: timestamp,
          unreadNumber: unreadNumber,
        });
      });
    } else {
      let firstConversation = {};
      let newConversations = conversationsRef.current.filter(
        (element, index) => {
          if (element.name != otherParty) {
            return true;
          } else {
            var unreadNumber = 1;
            //Only messages where you're the recipent(not the author) should be counted
            //as unread messages
            if (message.author == user) {
              unreadNumber = 0;
            }

            firstConversation = {
              photo: element.photo,
              name: element.name,
              text: message.message,
              timestamp: element.timestamp,
              unreadNumber: element.unreadNumber + unreadNumber,
            };
            return false;
          }
        },
      );

      newConversations.unshift(firstConversation);

      conversationsRef.current = newConversations;
    }
  };

  const selectConversation = selectedUser => {
    conversationsRef.current.map((element, index) => {
      if (element.name == selectedUser) {
        element.unreadNumber = 0;
      }
    });

    //Tell server that I read all of these
    const author = selectedUser;
    const recipent = localStorage.getItem("user");
    fetch(
      "https://collaborative-classroom-server.herokuapp.com/setasread?author=" +
        author +
        "&recipent=" +
        recipent,
      {
        method: "GET",
      },
    ).catch(error => {
      alert("Error occured!");
      console.log(error);
    });

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
      "https://collaborative-classroom-server.herokuapp.com/singlechat?recipent=" +
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
              var isUnread = 0;
              //Only messages where you're the recipent(not the author) should be counted
              //as unread messages
              if (element.recipent == user) {
                isUnread = isUnread + element.isunread;
              }
              newMessages[otherParty].push(element);
              newConversations[otherParty] = {
                photo: newConversations[otherParty].photo,
                name: otherParty,
                text: element.message,
                timestamp: parseInt(element.timestamp),
                unreadNumber:
                  newConversations[otherParty].unreadNumber +
                  parseInt(isUnread),
              };
            } else {
              var isUnread = 0;
              //Only messages where you're the recipent(not the author) should be counted
              //as unread messages
              if (element.recipent == user) {
                isUnread = isUnread + element.isunread;
              }
              newMessages[otherParty] = [element];
              var textSnippet = "";
              if (element.message.length <= 20) {
                textSnippet = element.message;
              } else {
                textSnippet = element.message.substring(0, 20) + "...";
              }

              newConversations[otherParty] = {
                photo: avatars[count],
                name: otherParty,
                text: element.message,
                textSnippet: textSnippet,
                timestamp: parseInt(element.timestamp),
                unreadNumber: parseInt(isUnread),
              };
              count = count + 1;
            }
          }
        });

        const newConversationsValues = Object.values(newConversations);
        newConversationsValues.sort(function(a, b) {
          var keyA = new Date(a.timestamp),
            keyB = new Date(b.timestamp);
          // Compare the 2 dates
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });
        //Map to required format for parsing
        conversationsRef.current = newConversationsValues;
        setConversations(newConversationsValues);

        const keyList = newConversations;
        var filteredMessages = [];
        if (keyList.length > 0) {
          filteredMessages = newMessages[keyList[0]];
          setActiveConversation(keyList[0]);
        }
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
