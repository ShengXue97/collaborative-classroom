import React, { Component } from "react";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import moment from "moment";

var start_time = "07:30";
var end_time = "08:30";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function TimePickers(props) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="time"
        label="start"
        type="time"
        onChange={e => {
          props.updateStartTime(e.target.value);
        }}
        defaultValue={start_time}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
    </form>
  );
}

function TimePickers2(props) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="time"
        label="end"
        type="time"
        onChange={e => {
          props.updateEndTime(e.target.value);
        }}
        defaultValue={end_time}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
    </form>
  );
}

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: "07:30",
      end: "08:30",
    };
  }

  updateStartTime = time => {
    this.setState({
      start: time,
    });
  };

  updateEndTime = time => {
    this.setState({
      end: time,
    });
  };
  render() {
    return (
      <MDBContainer>
        <MDBModal side position="bottom-right" isOpen={this.props.modalActive}>
          <MDBModalHeader>Dear Admin, please set the timing.</MDBModalHeader>
          <MDBModalBody>
            <TimePickers
              updateStartTime={time => {
                this.updateStartTime(time);
              }}
            />
            <TimePickers2
              updateEndTime={time => {
                this.updateEndTime(time);
              }}
            />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              onClick={() => {
                this.props.toggleModal();
              }}
            >
              Close
            </MDBBtn>
            <MDBBtn
              color="primary"
              onClick={() => {
                this.props.toggleModal();
                this.props.JoinHelper(
                  moment.duration(this.state.start),
                  moment.duration(this.state.end),
                  this.state.start,
                  this.state.end,
                );
              }}
            >
              Ok
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default Modal;
