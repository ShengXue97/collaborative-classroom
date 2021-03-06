import React, { useEffect, useState } from "react";
import shave from "shave";
import { MDBBadge, MDBContainer, MDBBtn } from "mdbreact";
import "./ConversationListItem.css";
import UserAvatar from "../../../material-admin/components/UserAvatar/UserAvatar";

export default function ConversationListItem(props) {
  const [badge, setBadge] = useState();
  const [unreadNumber, setUnreadNumber] = useState();
  const [color, setColor] = useState("mdb-color lighten-4");
  useEffect(() => {
    shave(".conversation-snippet", 20);
  }, []);

  useEffect(() => {
    setUnreadNumber(props.unreadNumber);
  }, [props.unreadNumber]);

  useEffect(() => {
    if (unreadNumber == 0) {
      setBadge();
      setColor("mdb-color lighten-4");
    } else {
      setBadge(
        <MDBBadge
          style={{ flex: "1", height: "15px", width: "5px" }}
          color="danger"
          className="ml-2"
        >
          {unreadNumber}
        </MDBBadge>,
      );
      setColor("primary");
    }
  }, [unreadNumber]);

  const { name, text, textSnippet } = props.data;

  const handleClick = () => {
    setUnreadNumber(0);
    props.updateSmallMessagesFiltered(name);
    props.selectConversation(name);
  };
  return (
    <MDBBtn
      className="conversation-list-item"
      onClick={() => handleClick()}
      color={color}
    >
      <div style={{ display: "flex" }}>
        <UserAvatar name={name} />
        <div
          style={{
            flex: "4",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h1 className="conversation-title">{name}</h1>
          <p className="conversation-snippet">{text}</p>
        </div>
        {badge}
      </div>
    </MDBBtn>
  );
}
