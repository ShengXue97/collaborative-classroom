import React, { useRef, useEffect, useState } from "react";
import Compose from "../Compose/Compose.js";
import Toolbar from "../Toolbar/Toolbar.js";
import ToolbarButton from "../ToolbarButton/ToolbarButton.js";
import Message from "../Message/Message.js";
import moment from "moment";

import "./MessageList.css";
import socket from "../../../websocket";
import allMessages from "../../../allMessages";

const MY_USER_ID = localStorage.getItem("user");

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

export default function MessageList(props) {
  const [messages, setMessages] = useState([]);
  const divRef = useRef(null);
  const messagesRef = useRef([]);

  const addMessage = message => {
    var newMessages = [message];
    setMessages([...messages, ...newMessages]);
  };

  useInterval(() => {
    console.log(messages);
    console.log(messagesRef.current);
    setMessages(JSON.parse(JSON.stringify(messagesRef.current)));
  }, 1000);

  useEffect(() => {
    getMessages(MY_USER_ID, 0);

    socket.on("newMessage", message => {
      console.log(messages);
      messagesRef.current.push(message);
    });
  }, []);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // window.setInterval(function() {
  //   getMessages(MY_USER_ID, 0);
  // }, 20 * 1000);

  const getMessages = (recipent, minTimestamp) => {
    fetch(
      "http://localhost:5000/singlechat?recipent=" +
        recipent +
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
        var newMessages = messages.concat(JSON.parse(data));

        var seenIDs = {};

        newMessages = newMessages.filter(function(currentObject) {
          if (currentObject.id in seenIDs) {
            return false;
          } else {
            seenIDs[currentObject.id] = true;
            return true;
          }
        });

        messagesRef.current = newMessages;
        setMessages(newMessages);
      });
  };

  const renderMessages = () => {
    console.log(messages);
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;
      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment),
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />,
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  };

  return (
    <div className="message-list">
      <Toolbar
        title="Conversation Title"
        rightItems={[
          <ToolbarButton
            key="info"
            icon="ion-ios-information-circle-outline"
          />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />,
        ]}
      />

      <div id="message-list-container">{renderMessages()}</div>
      <div style={{ float: "left", clear: "both" }} ref={divRef}></div>

      <Compose
        addMessage={addMessage}
        rightItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="money" icon="ion-ios-card" />,
          <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />,
        ]}
      />
    </div>
  );
}
