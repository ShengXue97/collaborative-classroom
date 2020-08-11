import React, { useState, useEffect, useRef } from "react";
import PropTypes, { string } from "prop-types";
import { Link } from "react-router-dom";
import "react-bulma-components/dist/react-bulma-components.min.css";
import {
  Section,
  Container,
  Columns,
  Button as AButton,
  Form,
  Notification,
} from "react-bulma-components";

import { Button } from "@material-ui/core";

import videoRoomPropType from "../../propTypes/videoRoom";
import LocalBox from "../VideoRoom/LocalBox";
import RemoteBox from "../VideoRoom/RemoteBox";
import FieldInput from "../Fields/FieldInput";
import ToolboxLayout from "../ToolboxLayout/ToolboxLayout.js";
import MaterialTable from "material-table";
//import Icon from "@material-ui/icons";

import AppContainer from "./AppContainer";
import Chat from "../../../chatbox/components/Chat/Chat.js";
import Quiz from "../../../quizbox/components/Quiz/Quiz.js";
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
import socket from "../../../websocket";

const ReactGridLayout = WidthProvider(RGL);
const userName = localStorage.getItem("user");

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
  const numbers = [1, 2, 3, 4, 5, 6];

  const [init, setInit] = useState(0);
  const [whiteboardChildList, setWhiteboardChildList] = useState([]);
  const [whiteboardCoordList, setWhiteboardCoordList] = useState([0, 0]);
  const [stateCheck, setStateCheck] = useState([0]);

  const [noOfElements, setNoOfElements] = useState(4);

  const [whiteBoardNum, setWhiteBoardNum] = useState(6);

  const [dropdownItems, setDropdownItems] = useState([]);
  const dropdownItemsRef = useRef([]);
  const receivedWhiteboards = useRef([]);
  const userListRef = useRef([]);

  useEffect(() => {
    socket.on("newWhiteboard", message => {
      const author = message.message.author;
      const recipent = message.message.recipent;
      const link = message.message.link;
      const userName = localStorage.getItem("user");
      if (
        recipent == userName &&
        !receivedWhiteboards.current.includes(author)
      ) {
        receivedWhiteboards.current.push(author);
        addWhiteBoard(author, link);
      }
    });

    socket.on("roomData", ({ users }) => {
      const userName = localStorage.getItem("user");
      const usersFiltered = users.filter((element, index) => {
        const otherUser = element.name;
        if (userName != otherUser) {
          return true;
        } else {
          return false;
        }
      });

      userListRef.current = usersFiltered.map((element, index) => {
        const otherUser = element.name;
        return (
          <Dropdown.Item onClick={() => shareWhiteboard(otherUser)}>
            {otherUser}
          </Dropdown.Item>
        );
      });

      const newState = stateCheck[0] + 1;
      setStateCheck([newState]);
    });
  }, []);

  const defaultDropdownItemsRef = useRef([
    <Dropdown.Item
      myname="whiteboard_0_selector"
      onClick={() => addElement("whiteboard_0")}
    >
      Class Whiteboard
    </Dropdown.Item>,
    <Dropdown.Item
      myname="whiteboard_1_selector"
      onClick={() => addElement("whiteboard_1")}
    >
      Private Whiteboard
    </Dropdown.Item>,
    <Dropdown.Item
      myname="localBox_selector"
      onClick={() => addElement("localBox")}
    >
      Local Video
    </Dropdown.Item>,
    <Dropdown.Item
      myname="remoteBox_selector"
      onClick={() => addElement("remoteBox")}
    >
      Remote Video
    </Dropdown.Item>,
    <Dropdown.Item myname="chat_selector" onClick={() => addElement("chat")}>
      Chatbox
    </Dropdown.Item>,
      <Dropdown.Item myname="quiz_selector" onClick={() => addElement("quiz")}>
        Quiz
      </Dropdown.Item>,
  ]);

  const addElement = name => {
    var elementToBeAdded = null;
    window.defaultGridElements.map(e => {
      if (name == e.props.id) {
        elementToBeAdded = e;
      }
    });

    if (elementToBeAdded != null) {
      if (name.includes("whiteboard")) {
        const whiteboardId = elementToBeAdded.props.id;
        const roomId = elementToBeAdded.props.id.split("_")[1];
        elementToBeAdded = (
          <div
            room={elementToBeAdded.props.room}
            class={"whiteboard"}
            publicName={elementToBeAdded.props.publicName}
            id={whiteboardId}
            style={{ background: "#FFD5B8" }}
            key={roomId}
            data-grid={{ x: 0, y: 0, w: 4, h: 4 }}
          >
            <Whiteboard
              publicName={elementToBeAdded.props.publicName}
              whiteboardChildList={whiteboardChildList}
              whiteboardCoordList={whiteboardCoordList}
              id={whiteboardId}
              removeElement={() => removeElement(whiteboardId)}
              onRef={ref => {
                whiteboardChildList.push(ref);
                whiteboardCoordList.push(0);
              }}
              room={elementToBeAdded.props.room}
            />
          </div>
        );
      }
      setNoOfElements(noOfElements + 1);
      window.gridElements.push(elementToBeAdded);
    }

    const newDropdownItems = dropdownItemsRef.current.map((element, index) => {
      if (element != undefined && element.props.myname != name + "_selector") {
        return element;
      }
    });

    setDropdownItems(newDropdownItems);
    dropdownItemsRef.current = newDropdownItems;

    const newState = stateCheck[0] + 1;
    setStateCheck([newState]);
  };

  const removeElement = name => {
    const newGridElements = [];
    window.gridElements.map(e => {
      if (name != e.props.id) {
        newGridElements.push(e);
      }
    });
    window.gridElements = newGridElements;
    const newDropdownItems = defaultDropdownItemsRef.current.filter(element => {
      if (element != undefined && element.props.myname == name + "_selector") {
        return true;
      } else {
        return false;
      }
    });

    dropdownItemsRef.current = dropdownItemsRef.current.concat(
      newDropdownItems,
    );
    setDropdownItems(dropdownItemsRef.current);
    const newState = stateCheck[0] + 1;
    setStateCheck([newState]);
  };

  const shareWhiteboard = recipent => {
    const author = localStorage.getItem("user");
    const link = roomName + "1" + userName.replace("@", "").replace(".", "");
    const message = {
      author: author,
      recipent: recipent,
      link: link,
    };
    socket.emit("shareWhiteboard", message);
  };

  const addWhiteBoard = (author, link) => {
    const whiteBoardName = author + "'s whiteboard";
    var jsx = (
      <div
        room={link}
        class={"whiteboard"}
        publicName={whiteBoardName}
        id={"whiteboard_" + whiteBoardNum}
        style={{ background: "#FFD5B8" }}
        key={whiteBoardNum}
        data-grid={{ x: 0, y: 8, w: 4, h: 4 }}
      >
        <Whiteboard
          publicName={whiteBoardName}
          whiteboardChildList={whiteboardChildList}
          whiteboardCoordList={whiteboardCoordList}
          id={"whiteboard_" + whiteBoardNum}
          removeElement={() => removeElement("whiteboard_" + whiteBoardNum)}
          onRef={ref => whiteboardChildList.push(ref)}
          room={link}
        />
      </div>
    );
    setNoOfElements(noOfElements + 1);
    setWhiteBoardNum(whiteBoardNum + 1);
    whiteboardCoordList.push([0]);
    window.gridElements.push(jsx);

    const newDropdownItem = (
      <Dropdown.Item
        myname={"whiteboard_" + whiteBoardNum + "_selector"}
        onClick={() => addElement("whiteboard_" + whiteBoardNum)}
      >
        {whiteBoardName}
      </Dropdown.Item>
    );

    defaultDropdownItemsRef.current.push(newDropdownItem);

    const newState = stateCheck[0] + 1;
    setStateCheck([newState]);
  };

  const myUser = localStorage.getItem("user");
  const myRoom = localStorage.getItem("room");
  onUserNameChange(myUser);
  onRoomNameChange(myRoom);

  const customJoin = customRoom => {
    localStorage.setItem("room", customRoom);
    onJoin();
  };

  const updateRoom = roomName => {
    if (modules_json != null) {
      if (modules_json.hasOwnProperty(roomName)) {
        localStorage.setItem("room", roomName);
      } else {
        fetch(
          "https://collaborative-classroom-server.herokuapp.com/getmodules?user=" +
            myUser,
          {
            method: "GET",
          },
        )
          .then(response => {
            return response.text();
          })
          .then(data => {
            if (data == "No modules yet!") {
              var dataJSON = JSON.parse(' {"m": [] }');
            } else {
              var dataJSON = JSON.parse(data);
            }
            dataJSON["m"].push(roomName);
            var newmods = JSON.stringify(dataJSON);
            localStorage.setItem("modules", newmods);
            fetch(
              "https://collaborative-classroom-server.herokuapp.com/updatemodules?modules=" +
                newmods +
                "&user=" +
                myUser,
              {
                method: "GET",
              },
            ).catch(error => {
              alert("Error occured! ID 7");
            });
          })
          .catch(error => {
            alert("Error occured! ID 8");
          });

        localStorage.setItem("room", roomName);
      }
    }
  };

  const modules = localStorage.getItem("modules");
  var buttonsJSX = null;

  if (modules != null) {
    var modules_json = JSON.parse(modules);

    buttonsJSX = modules_json["m"].map((element, index) => {
      return (
        <AButton
          name={modules_json["m"][index]}
          onClick={() => customJoin(modules_json["m"][index])}
        >
          {modules_json["m"][index]}
        </AButton>
      );
    });
  }

  const getJSX = () => {
    var defaultGrid = window.gridElements;
    if (init == 0) {
      setInit(1);
      setNoOfElements(6);
      defaultGrid = numbers.map(number => {
        if (number == 1) {
          return (
            <div
              room={roomName + "0"}
              class={"whiteboard"}
              publicName={"Class Whiteboard"}
              id={"whiteboard_0"}
              style={{ background: "#FFD5B8" }}
              key="0"
              data-grid={{ x: 0, y: 0, w: 4, h: 4 }}
            >
              <Whiteboard
                publicName={"Class Whiteboard"}
                whiteboardChildList={whiteboardChildList}
                whiteboardCoordList={whiteboardCoordList}
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
              room={roomName + "1" + userName.replace("@", "").replace(".", "")}
              class={"whiteboard"}
              publicName={"Private Whiteboard"}
              id={"whiteboard_1"}
              style={{ background: "#FFD5B8" }}
              key="1"
              data-grid={{ x: 0, y: 4, w: 4, h: 4 }}
            >
              <Whiteboard
                publicName={"Private Whiteboard"}
                whiteboardChildList={whiteboardChildList}
                whiteboardCoordList={whiteboardCoordList}
                id={"whiteboard_1"}
                removeElement={() => removeElement("whiteboard_1")}
                onRef={ref => whiteboardChildList.push(ref)}
                room={
                  roomName + "1" + userName.replace("@", "").replace(".", "")
                }
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
              id="localBox"
              style={{ background: "#FFD5B8" }}
              key="5"
              data-grid={{ x: 4, y: 0, w: 4, h: 2 }}
            >
              <LocalBox
                removeElement={() => removeElement("localBox")}
                videoRoom={videoRoom}
              />
            </div>
          );
        }  else if (number == 6) {
          return (
            <div
              id="quiz"
              style={{ background: "#FFD5B8" }}
              key="6"
              data-grid={{ x: 8, y: 0, w: 4, h: 6 }}
            >
              <Quiz removeElement={() => removeElement("quiz")}></Quiz>
            </div>
          );
        }
      })
      window.defaultGridElements = defaultGrid;
      window.gridElements = defaultGrid;
    }

    const jsx = defaultGrid.map(e => {
      return e;
    });
    return jsx;
  };

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

              <Dropdown.Menu id="dropdown-menu">{dropdownItems}</Dropdown.Menu>
            </Dropdown>
          </Form.Control>

          <Form.Control>
            <MDBBtn
              onClick={() => onShare()}
              disabled={!isScreenSharingSupported}
              color="info"
            >
              {isScreenSharingEnabled ? "Unshare Screen" : "Share Screen"}
            </MDBBtn>
            <Dropdown>
              <Dropdown.Toggle variant="warning" id="dropdown-basic">
                Share Whiteboard
              </Dropdown.Toggle>

              <Dropdown.Menu>{userListRef.current}</Dropdown.Menu>
            </Dropdown>
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
              if (
                whiteboardChild == undefined ||
                whiteboardCoordList[index] == undefined
              ) {
                return;
              }
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
                  whiteboardChildList[index].resize(false);
                }
                whiteboardCoordList[index] = tempCoords;
              }
              return 1;
            });
          }}
          onResizeStop={e => {
            whiteboardChildList.map((whiteboardChild, index) => {
              if (
                whiteboardChild == undefined ||
                whiteboardCoordList[index] == undefined
              ) {
                return;
              }
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
                onClick={() => {
                  updateRoom(roomName);
                  onJoin();
                }}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        ></div>
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
      {buttonsJSX}
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
