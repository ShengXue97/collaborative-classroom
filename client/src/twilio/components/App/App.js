import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

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

import AppContainer from "./AppContainer";
import Chat from '../../../chatbox/components/Chat/Chat.js';
import TextContainer from '../../../chatbox/components/TextContainer/TextContainer';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

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
  const [child, setChild] = useState('');

  if (!isVideoSupported) {
    content = <div>Video is not supported</div>;
  } else {
    content = videoRoom ? (
      <>
        <ReactGridLayout
          autoSize="true"
          className="layout"
          onResize={e => {
            const width = e[0]['w'];
            const height = e[0]['h'];
            child.resize(width, height)
          }}
        >
          <div style = {{backgroundColor:"blue"}} key="1" data-grid={{ x: 0, y: 0, w: 4, h: 4 }}>
            <TextContainer  onRef={ref => setChild(ref)} room={roomName}/>
          </div>

          <div style = {{backgroundColor:"blue"}} key="2" data-grid={{ x: 4, y: 0, w: 4, h: 2 }}>
            <LocalBox videoRoom={videoRoom} />
          </div>

          <div style = {{backgroundColor:"blue"}} key="3" data-grid={{ x: 4, y: 2, w: 4, h: 2 }}>
            <RemoteBox videoRoom={videoRoom} />
          </div>

          <div style = {{backgroundColor:"blue"}} key="4" data-grid={{ x: 8, y: 0, w: 4, h: 4 }}>
            <Chat name={userName} room={roomName}></Chat>
          </div>

        </ReactGridLayout>

        

        <Form.Field kind="group" align="centered">
          <Form.Control>
            <Button onClick={() => onLeave()}>Leave</Button>
          </Form.Control>

          <Form.Control>
            <Button
              onClick={() => onShare()}
              disabled={!isScreenSharingSupported}
            >
              {isScreenSharingEnabled ? "Stop sharing" : "Start sharing"}
            </Button>
          </Form.Control>
        </Form.Field>
      </>
    ) : (
      <Columns>
        <Columns.Column size="half" offset="one-quarter">
          <FieldInput
            value={userName}
            name="userName"
            label="User"
            placeholder="The identifier of the user"
            onChange={onUserNameChange}
          />

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
    <Section>
      <Container>
        <h1>Twilio Video chat with screen sharing</h1>
        {errorMessage && (
          <Notification color="danger">
            Error: {errorMessage}
            <Button onClick={onErrorMessageHide} remove />
          </Notification>
        )}
        {content}
      </Container>
    </Section>
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
  errorMessage: null
};

const render = containerProps => <App {...containerProps} />;
export default props => <AppContainer render={render} {...props} />;
