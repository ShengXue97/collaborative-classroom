import React, { useRef, useEffect, useState } from "react";
import Compose from "../Compose/Compose.js";
import Toolbar from "../Toolbar/Toolbar.js";
import ToolbarButton from "../ToolbarButton/ToolbarButton.js";
import Message from "../Message/Message.js";
import moment from "moment";

import "./MessageList.css";
import socket from "../../../websocket";
import allMessages from "../../../allMessages";

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
  const [activeConversation, setActiveConversation] = useState("");
  const divRef = useRef(null);
  const messagesRef = useRef([]);
  const fullMessagesRef = useRef([]);
  const activeConversationRef = useRef("");

  useInterval(() => {
    setMessages(JSON.parse(JSON.stringify(messagesRef.current)));
  }, 1000);

  useEffect(() => {
    socket.on("newMessage", message => {
      //IMPORTANT: State is not kept inside here(socket.on), only Ref.
      const user = localStorage.getItem("user");
      console.log(
        user,
        message.recipent,
        activeConversationRef.current,
        message.author,
      );

      var otherParty = "";
      if (message.author == user) {
        otherParty = message.recipent;
      } else if (message.recipent == user) {
        otherParty = message.author;
      }

      if (otherParty != "" && otherParty != user) {
        // This message belongs to me

        if (otherParty in fullMessagesRef.current) {
          //This conversation exists in my list
          fullMessagesRef.current[otherParty].push(message);
          message.isNew = false;
          message.otherParty = otherParty;
          props.updateConversation(message);
        } else {
          //This is a new conversation! Someone new messaged me, or I messafed someone new.
          fullMessagesRef.current[otherParty] = [message];
          message.isNew = true;
          message.otherParty = otherParty;
          props.updateConversation(message);
        }
      }
    });
  }, []);

  useEffect(() => {
    setMessages(props.filteredMessages);
    messagesRef.current = props.filteredMessages;
  }, [props.filteredMessages]);

  useEffect(() => {
    fullMessagesRef.current = props.fullMessages;
  }, [props.fullMessages]);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setActiveConversation(props.activeConversation);
    activeConversationRef.current = props.activeConversation;
  }, [props.activeConversation]);

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];
    const MY_USER_ID = localStorage.getItem("user");

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

        if (prevBySameAuthor && previousDuration.as("hours") < 1 / 60) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1 / 60) {
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
        title={activeConversation}
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
        activeConversation={activeConversation}
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
