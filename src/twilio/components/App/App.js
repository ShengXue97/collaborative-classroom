import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import "react-bulma-components/dist/react-bulma-components.min.css";
import {
  Section,
  Container,
  Columns,
  Button,
  Form,
  Notification
} from "react-bulma-components";

import videoRoomPropType from "../../propTypes/videoRoom";
import LocalBox from "../VideoRoom/LocalBox";
import RemoteBox from "../VideoRoom/RemoteBox";
import FieldInput from "../Fields/FieldInput";
import ToolboxLayout from "../ToolboxLayout/ToolboxLayout.js";

import AppContainer from "./AppContainer";
import Chat from '../../../chatbox/components/Chat/Chat.js';
import Whiteboard from '../../../chatbox/components/Whiteboard/Whiteboard.js';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import RGL, { WidthProvider } from "react-grid-layout";
import leaveRoomIcon from '../../icons/leaveRoom.png';

import './App.css';

import Dropdown from 'react-bootstrap/Dropdown'
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

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
}

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
  onErrorMessageHide
}) => {
  let content = null;
  const numbers = [1, 2, 3, 4];

  const [init, setInit] = useState(0);
  const [whiteboardChild, setWhiteboardChild] = useState('');
  const [whiteboardCoords, setWhiteboardCoords] = useState('');
  const [localBoxCoords, setLocalBoxCoords] = useState('');
  const [noOfElements, setNoOfElements] = useState(4);
  
  const [whiteboardActive, setWhiteboardActive] = useState(true);
  const [localBoxActive, setLocalBoxActive] = useState(true);
  const [remoteBoxActive, setRemoteBoxActive] = useState(true);
  const [chatActive, setChatActive] = useState(true);

  const checkElement = (name) => {
    var isDelete = false;
    if (name == "whiteboard" && whiteboardActive){
      isDelete = true;
    } else if (name == "localBox" && localBoxActive){
      isDelete = true;
    } else if (name == "remoteBox" && remoteBoxActive){
      isDelete = true;
    } else if (name == "chat" && chatActive){
      isDelete = true;
    }

    if (isDelete){
      removeElement(name);
    } else {
      addElement(name);
    }
  }

  const addElement = (name) => {
    var elementToBeAdded = null;
    console.log(name);
    window.defaultGridElements.map((e) => {
      if (name == e.props.id){
        elementToBeAdded = e;
        if (name == "whiteboard"){
          setWhiteboardActive(true);
        } else if (name == "localBox"){
          setLocalBoxActive(true);
        } else if (name == "remoteBox"){
          setRemoteBoxActive(true);
        } else if (name == "chat"){
          setChatActive(true);
        }
      }
    })

    if (elementToBeAdded != null){
      setNoOfElements(noOfElements + 1);
      window.gridElements.push(elementToBeAdded);
    }
  }

  const removeElement = (name) => {
    const newGridElements = []
    window.gridElements.map((e) => {
      if (name == e.props.id){
        if (name == "whiteboard"){
          setWhiteboardActive(false);
        } else if (name == "localBox"){
          setLocalBoxActive(false);
        } else if (name == "remoteBox"){
          setRemoteBoxActive(false);
        } else if (name == "chat"){
          setChatActive(false);
        }
      } else {
        newGridElements.push(e);
      }
    })
    window.gridElements = newGridElements;
  }


  const getJSX = () => {
    var defaultGrid = window.gridElements;
    if (init == 0){
      setInit(1);
      setNoOfElements(5);
      defaultGrid = (numbers.map((number) => {
          if (number == 1){
            return <div id = "whiteboard" style = {{background:"#FFD5B8"}} key="1" data-grid={{ x: 0, y: 0, w: 4, h: 4}}>
              <Whiteboard  removeElement = {() => removeElement("whiteboard")} onRef={ref => setWhiteboardChild(ref)} room={roomName}/>
            </div>
          } else if (number == 2){
            return <div id = "localBox" style = {{background:"#FFD5B8"}} key="2" data-grid={{ x: 4, y: 0, w: 4, h: 2 }}>
              <LocalBox removeElement = {() => removeElement("localBox")} videoRoom={videoRoom} />
            </div>
          } else if (number == 3){
            return <div id = "remoteBox" style = {{background:"#FFD5B8"}} key="3" data-grid={{ x: 4, y: 2, w: 4, h: 2 }}>
              <RemoteBox removeElement = {() => removeElement("remoteBox")} videoRoom={videoRoom} />
            </div>
          } else if (number == 4){
            return <div id = "chat" style = {{background:"#FFD5B8"}} key="4" data-grid={{ x: 8, y: 0, w: 4, h: 4 }}>
              <Chat removeElement = {() => removeElement("chat")} name={userName} room={roomName}></Chat>
            </div>
          }
        }));
      window.defaultGridElements = defaultGrid;
      window.gridElements = defaultGrid;
    }

    const jsx = defaultGrid.map((e) => {
      return e
    })
    return jsx
  }

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
                <Dropdown.Item active = {whiteboardActive} onClick={() => checkElement("whiteboard")}>Whiteboard</Dropdown.Item>
                <Dropdown.Item active = {localBoxActive} onClick={() => checkElement("localBox")}>Local Video</Dropdown.Item>
                <Dropdown.Item active = {remoteBoxActive} onClick={() => checkElement("remoteBox")}>Remote Video</Dropdown.Item>
                <Dropdown.Item active = {chatActive} onClick={() => checkElement("chat")}>Chatbox</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Control>

          <Form.Control>
            <Button
              onClick={() => onShare()}
              disabled={!isScreenSharingSupported}
            >
              {isScreenSharingEnabled ? "Stop sharing" : "Start sharing"}
            </Button>
          </Form.Control>

          <a href="/app/dashboard"><img src={leaveRoomIcon} alt="close icon" /></a>

        </Form.Field>
        
        <ReactGridLayout
          autoSize={true}
          className="layout"
          onResize={e => {
            if (document.querySelector('#whiteboard') != null){
              var tempWidth = getComputedStyle(document.querySelector('#whiteboard')).width;
              var tempHeight = getComputedStyle(document.querySelector('#whiteboard')).height;
              var tempCoords = {
                "width": tempWidth,
                "height": tempHeight
              }

              if (!isEquivalent(tempCoords,whiteboardCoords)){
                whiteboardChild.resize(false);
              }
              setWhiteboardCoords(tempCoords);
            }
          }}

          onResizeStop={e => {
            if (document.querySelector('#whiteboard') != null){
              var tempWidth = getComputedStyle(document.querySelector('#whiteboard')).width;
              var tempHeight = getComputedStyle(document.querySelector('#whiteboard')).height;
              var tempCoords = {
                "width": tempWidth,
                "height": tempHeight
              }

              if (!isEquivalent(tempCoords,whiteboardCoords)){
                whiteboardChild.resize(true);
              }
              setWhiteboardCoords(tempCoords);
            }
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
          
        </Columns.Column>
      </Columns>
      
    );
  }

  return (
    <div id ="bgdiv">
      {errorMessage && (
        <Notification color="danger">
          Error: {errorMessage}
          <Button onClick={onErrorMessageHide} remove />
        </Notification>
      )}
      {content}
      <div style={{paddingBottom:"1000px"}}>
      </div>
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
  onErrorMessageHide: PropTypes.func.isRequired
};

App.defaultProps = {
  videoRoom: null,
  errorMessage: null,
};

const render = containerProps => <App {...containerProps} />;
export default props => <AppContainer render={render} {...props} />;
