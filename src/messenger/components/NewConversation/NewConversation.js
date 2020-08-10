import React, { Component, useEffect, useState } from "react";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";

import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
} from "@material-ui/core";

import socket from "../../../websocket";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

export default function NewConversation(props) {
  var [message, setMessage] = useState("");

  const toggle = () => {
    props.toggleModal();
  };

  const setRecipentValue = value => {
    props.updateRecipentBox(value);
  };

  const setMessageValue = value => {
    props.updateMessageBox(value);
  };

  const sendMessage = () => {
    toggle();
    setRecipentValue("");
    setMessageValue("");

    const id = -1;
    const author = localStorage.getItem("user");
    const timestamp = new Date().getTime();
    const groupname = "none";

    const newMessage = {
      id: id,
      author: author,
      message: props.messageBox,
      recipent: props.recipentBox,
      timestamp: timestamp,
      groupname: groupname,
    };
    if (props.messageBox.length <= 0 || props.recipentBox.length <= 0) {
      return;
    }

    fetch(
      "https://collaborative-classroom-server.herokuapp.com/sendmessage?author=" +
        author +
        "&recipent=" +
        props.recipentBox +
        "&message=" +
        props.messageBox +
        "&timestamp=" +
        timestamp +
        "&groupname=" +
        groupname,
      {
        method: "GET",
      },
    )
      .then(response => {})
      .then(data => {
        console.log(data);
        socket.emit(
          "publishMessage",
          id,
          author,
          props.recipentBox,
          props.messageBox,
          timestamp,
          groupname,
        );
      })
      .catch(error => {
        alert("Error occured! ID 6");
        console.log(error);
      });
  };

  return (
    <MDBContainer>
      <MDBBtn onClick={toggle}>Compose</MDBBtn>

      <MDBModal
        side
        position="bottom-right"
        isOpen={props.modal}
        toggle={toggle}
      >
        <MDBModalHeader>Send Message</MDBModalHeader>
        <MDBModalBody>
          <TextField
            id="recipent"
            onChange={e => props.updateRecipentBox(e.target.value)}
            value={props.recipentBox}
            margin="normal"
            placeholder="recipent"
            type="recipent"
            fullWidth
          />
          <TextField
            id="message"
            onChange={e => props.updateMessageBox(e.target.value)}
            value={props.messageBox}
            margin="normal"
            placeholder="message"
            type="message"
            fullWidth
          />
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={toggle}>
            Cancel
          </MDBBtn>
          <MDBBtn color="primary" onClick={sendMessage}>
            Send
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
  );
}
