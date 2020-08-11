import React, { Component, Fragment } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";

import onlineIcon from "../icons/onlineIcon.png";

import closeIcon from "../icons/closeIcon.png";

import "./Whiteboard.css";

import Iframe from "react-iframe";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBContainer,
} from "mdbreact";

import { Button } from "react-bulma-components";

export default class Whiteboard extends Component {
  constructor(props) {
    super(props);
    const str = "#whiteboard";
    var tempWidth = 4 * 63.5 + "px";
    var tempHeight = 4 * 148 + "px";

    this.state = {
      width: tempWidth,
      height: tempHeight,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.resize(true);
  }

  // componentWillUnmount() {
  //   this.props.onRef(undefined);
  // }

  addWhiteboardChild() {
    this.props.whiteboardChildList.push(this);
    this.props.whiteboardCoordList.push(this);
  }

  resize(snap) {
    var str =
      ".react-grid-item.react-grid-placeholder.cssTransforms.react-resizable-hide.react-resizable";
    if (!snap) {
      str = "#whiteboard";
    }

    if (document.querySelector(str) != null) {
      var tempWidth = getComputedStyle(
        document.querySelector(str),
      ).width.replace("px", "");
      var tempHeight = getComputedStyle(
        document.querySelector(str),
      ).height.replace("px", "");
      this.setState({
        width: parseInt(tempWidth, 10) + "px",
        height: parseInt(tempHeight, 10) - 35 + "px",
      });
    }
  }

  render() {
    const myurl =
      "https://collaborative-classroom-board.herokuapp.com/boards/" +
      this.props.room;

    return (
      <div style={{ background: "#FFF9AA" }}>
        {/* <div>
        <h1>Realtime Chat Application <span role="img" aria-label="emoji">💬</span></h1>
        <h2>Created with React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h2>
        <h2>Try it out right now! <span role="img" aria-label="emoji">⬅️</span></h2>
      </div> */}
        {true ? (
          <div>
            <div className="infoBar">
              <div className="leftInnerContainer">
                <p
                  style={{
                    paddingTop: "15px",
                    paddingLeft: "10px",
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  {this.props.publicName}
                </p>
              </div>
              <div className="rightInnerContainer">
                <span
                  className={"delete-btn"}
                  onClick={() => this.props.removeElement()}
                >
                  X
                </span>
              </div>
            </div>

            <Iframe
              url={myurl}
              style="background: #FFF9AA;"
              width={this.state.width}
              height={this.state.height}
              id="myId"
              className="myClassname"
              display="initial"
              position="relative"
            />

            {/* <h4>People currently chatting:</h4>
                <div className="activeContainer">
                  <h5>
                    {users.map(({name}) => (
                      <div key={name} className="activeItem">
                        {name}
                        <img alt="Online Icon" src={onlineIcon}/>
                      </div>
                    ))}
                  </h5>
                </div> */}
          </div>
        ) : null}
      </div>
    );
  }
}
