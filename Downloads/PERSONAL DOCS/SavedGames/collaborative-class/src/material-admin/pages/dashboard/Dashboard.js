import React, { useEffect, useState, useRef } from "react";
// components
import PageTitle from "../../components/PageTitle";

import App from "../../../twilio/components/App/App.js";
import socket from "../../../websocket";
import Iframe from "react-iframe";
import AvatarStack from "../../components/AvatarStack/AvatarStack";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import { Typography } from "../../Wrappers/Wrappers.js";
import useStyles from "./styles";

import ReactEmoji from "react-emoji";
import {
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";

export default function Dashboard(props) {
  var classes = useStyles();
  const [roomData, setRoomData] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    socket.on("roomData", ({ users }) => {
      const usersJSX = users.map((element, index) => {
        return <UserAvatar name={element.name} />;
      });
      setRoomData(usersJSX);
    });

    socket.emit("init", { user }, error => {});
  }, []);

  useEffect(() => {
  }, [roomData]);

  const mustReload = localStorage.getItem("mustReload");
  if (mustReload != null && mustReload == 1) {
    localStorage.setItem("mustReload", 0);
    window.location.reload(false);
  }
  var roomName = localStorage.getItem("room");
  var content =
    roomData.length > 0 ? (
      <>
        <MDBBtn disabled={true} color="info">
          {roomName}
        </MDBBtn>
        <AvatarStack>{roomData}</AvatarStack>
      </>
    ) : (
      <p></p>
    );

  return (
    <>
      <PageTitle title="Dashboard" button="Room List" />
      {content}

      <App />
    </>
  );
}
