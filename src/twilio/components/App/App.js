import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "react-bulma-components/dist/react-bulma-components.min.css";
import {
  Section,
  Container,
  Columns,
  Button,
  Form,
  Notification,
} from "react-bulma-components";

import videoRoomPropType from "../../propTypes/videoRoom";
import LocalBox from "../VideoRoom/LocalBox";
import RemoteBox from "../VideoRoom/RemoteBox";
import FieldInput from "../Fields/FieldInput";
import ToolboxLayout from "../ToolboxLayout/ToolboxLayout.js";

import AppContainer from "./AppContainer";
import Chat from "../../../chatbox/components/Chat/Chat.js";
import Whiteboard from "../../../chatbox/components/Whiteboard/Whiteboard.js";

import "react-resizable/css/styles.css";
import "react-grid-layout/css/styles.css";
import RGL, { WidthProvider } from "react-grid-layout";
import leaveRoomIcon from "../../icons/leaveRoom.png";

import "./App.css";

import Dropdown from "react-bootstrap/Dropdown";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import {
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";

const ReactGridLayout = WidthProvider(RGL);

const isEquivalent = (a, b) => {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};

const App = ({
  videoRoom,
  userName,
  roomName,
  isJoining,
  isVideoSupported,
  isScreenSharingSupported,
  isScreenSharingEnabled,
  canJoin,
  onJoin,
  onLeave,
  onShare,
  onUserNameChange,
  onRoomNameChange,
  errorMessage,
  onErrorMessageHide,
  audioChecked,
  onAudioCheckedChange,
  videoChecked,
  onVideoCheckedChange,
}) => {
  let content = null;
  const numbers = [1, 2, 3, 4, 5];

  const [init, setInit] = useState(0);
  const [whiteboardChildList, setWhiteboardChildList] = useState([]);
  const [whiteboardCoordList, setWhiteboardCoordList] = useState([0, 0]);

  const [noOfElements, setNoOfElements] = useState(4);

  const [whiteBoardNum, setWhiteBoardNum] = useState(2);

  const [whiteboardActiveList, setWhiteboardActiveList] = useState([
    true,
    true,
  ]);
  const [localBoxActive, setLocalBoxActive] = useState(true);
  const [remoteBoxActive, setRemoteBoxActive] = useState(true);
  const [chatActive, setChatActive] = useState(true);

  const checkElement = name => {
    var isDelete = false;
    if (name.includes("whiteboard")) {
      console.log(name);
      var whiteBoardNum = name.split("_")[1];
      if (
        whiteboardActiveList.length - 1 >= whiteBoardNum &&
        whiteboardActiveList[whiteBoardNum]
      ) {
        console.log("hi");
        isDelete = true;
      }
    } else if (name == "localBox" && localBoxActive) {
      isDelete = true;
    } else if (name == "remoteBox" && remoteBoxActive) {
      isDelete = true;
    } else if (name == "chat" && chatActive) {
      isDelete = true;
    }

    if (isDelete) {
      removeElement(name);
    } else {
      addElement(name);
    }
  };

  const addElement = name => {
    var elementToBeAdded = null;
    window.defaultGridElements.map(e => {
      if (name == e.props.id) {
        elementToBeAdded = e;
        console.log(name);
        if (name.includes("whiteboard")) {
          var whiteBoardNum = name.split("_")[1];
          console.log(whiteBoardNum);
          whiteboardActiveList[whiteBoardNum] = true;
        } else if (name == "localBox") {
          setLocalBoxActive(true);
        } else if (name == "remoteBox") {
          setRemoteBoxActive(true);
        } else if (name == "chat") {
          setChatActive(true);
        }
      }
    });

    if (elementToBeAdded != null) {
      setNoOfElements(noOfElements + 1);
      window.gridElements.push(elementToBeAdded);
    }
  };

  const removeElement = name => {
    const newGridElements = [];
    window.gridElements.map(e => {
      if (name == e.props.id) {
        if (name.includes("whiteboard")) {
          var whiteBoardNum = name.split("_")[1];
          console.log(whiteBoardNum);
          whiteboardActiveList[whiteBoardNum] = false;
        } else if (name == "localBox") {
          setLocalBoxActive(false);
        } else if (name == "remoteBox") {
          setRemoteBoxActive(false);
        } else if (name == "chat") {
          setChatActive(false);
        }
      } else {
        newGridElements.push(e);
      }
    });
    window.gridElements = newGridElements;
  };

  const addWhiteBoard = () => {
    var jsx = (
      <div
        class={"whiteboard"}
        id={"whiteboard_".concat(whiteBoardNum)}
        style={{ background: "#FFD5B8" }}
        key={noOfElements + 1}
        data-grid={{ x: 0, y: 8, w: 4, h: 4 }}
      >
        <Whiteboard
          id={"whiteboard_".concat(whiteBoardNum)}
          removeElement={() =>
            removeElement("whiteboard_".concat(whiteBoardNum))
          }
          onRef={ref => whiteboardChildList.push(ref)}
          room={roomName + whiteBoardNum}
        />
      </div>
    );
    setNoOfElements(noOfElements + 1);
    setWhiteBoardNum(whiteBoardNum + 1);
    whiteboardCoordList.push([0]);
    whiteboardActiveList.push(true);
    window.gridElements.push(jsx);
  };

  const getJSX = () => {
    var defaultGrid = window.gridElements;
    if (init == 0) {
      setInit(1);
      setNoOfElements(5);
      defaultGrid = numbers.map(number => {
        if (number == 1) {
          return (
            <div
              class={"whiteboard"}
              id={"whiteboard_0"}
              style={{ background: "#FFD5B8" }}
              key="1"
              data-grid={{ x: 0, y: 0, w: 4, h: 4 }}
            >
              <Whiteboard
                id="whiteboard_0"
                removeElement={() => removeElement("whiteboard_0")}
                onRef={ref => whiteboardChildList.push(ref)}
                room={roomName + "0"}
              />
            </div>
          );
        } else if (number == 2) {
          return (
            <div
              id="localBox"
              style={{ background: "#FFD5B8" }}
              key="2"
              data-grid={{ x: 4, y: 0, w: 4, h: 2 }}
            >
              <LocalBox
                removeElement={() => removeElement("localBox")}
                videoRoom={videoRoom}
              />
            </div>
          );
        } else if (number == 3) {
          return (
            <div
              id="remoteBox"
              style={{ background: "#FFD5B8" }}
              key="3"
              data-grid={{ x: 4, y: 2, w: 4, h: 2 }}
            >
              <RemoteBox
                removeElement={() => removeElement("remoteBox")}
                videoRoom={videoRoom}
              />
            </div>
          );
        } else if (number == 4) {
          return (
            <div
              id="chat"
              style={{ background: "#FFD5B8" }}
              key="4"
              data-grid={{ x: 8, y: 0, w: 4, h: 4 }}
            >
              <Chat removeElement={() => removeElement("chat")}></Chat>
            </div>
          );
        } else if (number == 5) {
          return (
            <div
              class={"whiteboard"}
              id={"whiteboard_1"}
              style={{ background: "#FFD5B8" }}
              key="5"
              data-grid={{ x: 0, y: 4, w: 4, h: 4 }}
            >
              <Whiteboard
                id={"whiteboard_1"}
                removeElement={() => removeElement("whiteboard_1")}
                onRef={ref => whiteboardChildList.push(ref)}
                room={roomName + "1"}
              />
            </div>
          );
        }
      });
      window.defaultGridElements = defaultGrid;
      window.gridElements = defaultGrid;
    }

    const jsx = defaultGrid.map(e => {
      return e;
    });
    return jsx;
  };

  const myUser = localStorage.getItem("user");
  const myRoom = localStorage.getItem("room");
  onUserNameChange(myUser);
  onRoomNameChange(myRoom);

  if (!isVideoSupported) {
    content = <div>Video is not supported</div>;
  } else {
    content = videoRoom ? (
      <>
        <Form.Field kind="group" align="centered">
          <Form.Control>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Tools
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  active={whiteboardActiveList}
                  onClick={() => checkElement("whiteboard_0")}
                >
                  Private Whiteboard
                </Dropdown.Item>
                <Dropdown.Item
                  active={whiteboardActiveList}
                  onClick={() => checkElement("whiteboard_1")}
                >
                  Class Whiteboard
                </Dropdown.Item>
                <Dropdown.Item
                  active={localBoxActive}
                  onClick={() => checkElement("localBox")}
                >
                  Local Video
                </Dropdown.Item>
                <Dropdown.Item
                  active={remoteBoxActive}
                  onClick={() => checkElement("remoteBox")}
                >
                  Remote Video
                </Dropdown.Item>
                <Dropdown.Item
                  active={chatActive}
                  onClick={() => checkElement("chat")}
                >
                  Chatbox
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Control>

          <Form.Control>
            <MDBBtn
              onClick={() => onShare()}
              disabled={!isScreenSharingSupported}
              color="info"
            >
              {isScreenSharingEnabled ? "Stop sharing" : "Start sharing"}
            </MDBBtn>
            <MDBBtn onClick={() => addWhiteBoard()} color="info">
              {"Add Whiteboard"}
            </MDBBtn>
          </Form.Control>
          <FormControlLabel
            control={
              <Switch
                checked={audioChecked}
                onChange={onAudioCheckedChange}
                defaultChecked={audioChecked}
                name="audiocheck"
              />
            }
            label="Audio"
          />
          <FormControlLabel
            control={
              <Switch
                checked={videoChecked}
                onChange={onVideoCheckedChange}
                defaultChecked={videoChecked}
                name="videocheck"
              />
            }
            label="Video"
          />
          <MDBBtn
            onClick={() => {
              window.location.reload(false);
            }}
          >
            Leave Room
          </MDBBtn>
        </Form.Field>

        <ReactGridLayout
          autoSize={true}
          className="layout"
          onResize={e => {
            whiteboardChildList.map((whiteboardChild, index) => {
              var element = document.querySelector(
                "#".concat(whiteboardChild.props.id),
              );
              if (element != null) {
                console.log("hi");
                var tempWidth = getComputedStyle(element).width;
                var tempHeight = getComputedStyle(element).height;
                var tempCoords = {
                  width: tempWidth,
                  height: tempHeight,
                };

                if (!isEquivalent(tempCoords, whiteboardCoordList[index])) {
                  whiteboardChildList[index].resize(false);
                }
                whiteboardCoordList[index] = tempCoords;
              }
              return 1;
            });
          }}
          onResizeStop={e => {
            whiteboardChildList.map((whiteboardChild, index) => {
              var element = document.querySelector(
                "#".concat(whiteboardChild.props.id),
              );
              if (element != null) {
                var tempWidth = getComputedStyle(element).width;
                var tempHeight = getComputedStyle(element).height;
                var tempCoords = {
                  width: tempWidth,
                  height: tempHeight,
                };

                if (!isEquivalent(tempCoords, whiteboardCoordList[index])) {
                  whiteboardChildList[index].resize(true);
                }
                whiteboardCoordList[index] = tempCoords;
              }
              return 1;
            });
          }}
        >
          {getJSX()}
        </ReactGridLayout>
      </>
    ) : (
      <Columns>
        <Columns.Column size="half" offset="one-quarter">
          <FieldInput
            value={roomName}
            name="roomName"
            label="Room"
            placeholder="The name of the room that you want to join"
            onChange={onRoomNameChange}
          />

          <Form.Field kind="group" align="centered">
            <Form.Control>
              <Button
                onClick={() => onJoin()}
                loading={isJoining}
                disabled={!canJoin}
                color="primary"
              >
                Join
              </Button>
            </Form.Control>
          </Form.Field>
          <Form.Field kind="group" align="centered">
            <Form.Control>
              <FormControlLabel
                control={
                  <Switch
                    checked={audioChecked}
                    onChange={onAudioCheckedChange}
                    defaultChecked={audioChecked}
                    name="checkedA"
                  />
                }
                label="Audio"
              />
            </Form.Control>
          </Form.Field>

          <Form.Field kind="group" align="centered">
            <Form.Control>
              <FormControlLabel
                control={
                  <Switch
                    checked={videoChecked}
                    onChange={onVideoCheckedChange}
                    defaultChecked={videoChecked}
                    name="checkedA"
                  />
                }
                label="Video"
              />
            </Form.Control>
          </Form.Field>
        </Columns.Column>
      </Columns>
    );
  }

  return (
    <div id="bgdiv">
      {errorMessage && (
        <Notification color="danger">
          Error: {errorMessage}
          <Button onClick={onErrorMessageHide} remove />
        </Notification>
      )}
      {content}
      <div style={{ paddingBottom: "1000px" }}></div>
    </div>
  );
};

App.propTypes = {
  videoRoom: videoRoomPropType,
  userName: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  isJoining: PropTypes.bool.isRequired,
  isVideoSupported: PropTypes.bool.isRequired,
  isScreenSharingSupported: PropTypes.bool.isRequired,
  isScreenSharingEnabled: PropTypes.bool.isRequired,
  canJoin: PropTypes.bool.isRequired,
  onJoin: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onUserNameChange: PropTypes.func.isRequired,
  onRoomNameChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  onErrorMessageHide: PropTypes.func.isRequired,
  audioChecked: PropTypes.func.isRequired,
  videoChecked: PropTypes.func.isRequired,
  onAudioCheckedChange: PropTypes.func.isRequired,
  onVideoCheckedChange: PropTypes.func.isRequired,
};

App.defaultProps = {
  videoRoom: null,
  errorMessage: null,
};

const render = containerProps => <App {...containerProps} />;
export default props => <AppContainer render={render} {...props} />;
