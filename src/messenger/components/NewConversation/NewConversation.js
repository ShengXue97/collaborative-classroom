import React, { Component } from "react";
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

class NewConversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipent: "",
      message: "",
    };
  }
  state = {
    modal: false,
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  setRecipentValue = value => {
    this.setState({
      recipent: value,
    });
  };

  setMessageValue = value => {
    this.setState({
      message: value,
    });
  };

  sendMessage = () => {
    this.toggle();
    const id = -1;
    const author = localStorage.getItem("user");
    const message = this.state.message;
    const recipent = this.state.recipent;
    const minTimestamp = new Date().getTime();
    const groupname = "none";

    const newMessage = {
      id: id,
      author: author,
      message: message,
      recipent: recipent,
      timestamp: minTimestamp,
      groupname: groupname,
    };

    console.log(newMessage);

    fetch(
      "https://collaborative-classroom-server.herokuapp.com/sendmessage?author=" +
        author +
        "&recipent=" +
        recipent +
        "&message=" +
        message +
        "&groupname=" +
        groupname,
      {
        method: "GET",
      },
    )
      .then(response => {})
      .then(data => {
        socket.emit(
          "publishMessage",
          id,
          author,
          recipent,
          message,
          minTimestamp,
          groupname,
        );
      });
  };

  render() {
    return (
      <MDBContainer>
        <Button onClick={this.toggle}>Compose</Button>

        <MDBModal
          side
          position="bottom-right"
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <MDBModalHeader>Send Message</MDBModalHeader>
          <MDBModalBody>
            <TextField
              id="recipent"
              onChange={e => this.setRecipentValue(e.target.value)}
              margin="normal"
              placeholder="recipent"
              type="recipent"
              fullWidth
            />
            <TextField
              id="message"
              onChange={e => this.setMessageValue(e.target.value)}
              margin="normal"
              placeholder="message"
              type="message"
              fullWidth
            />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle}>
              Cancel
            </MDBBtn>
            <MDBBtn color="primary" onClick={this.sendMessage}>
              Send
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default NewConversation;
