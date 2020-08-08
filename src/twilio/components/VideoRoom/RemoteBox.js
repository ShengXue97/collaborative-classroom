import React, { PureComponent } from "react";
import { Panel, Columns } from "react-bulma-components";
import { isEmpty } from "lodash";

import videoRoomPropType from "../../propTypes/videoRoom";
import Participant from "../Participant/Participant";
import LocalParticipant from "../Participant/LocalParticipant";
import EventSubscriber from "../EventSubscriber/EventSubscriber";
import { mapToArray } from "../../utils";

import closeIcon from "../../../chatbox/components/icons/closeIcon.png";
import "./RemoteBox.css";

const EVENTS = [
  "dominantSpeakerChanged",
  "participantConnected",
  "participantDisconnected",
  "reconnected",
  "reconnecting",
  "trackDimensionsChanged",
  "trackDisabled",
  "trackEnabled",
  "trackPublished",
  "trackStarted",
  "trackSubscribed",
  "trackUnpublished",
  "trackUnsubscribed",
];

class VideoRoom extends PureComponent {
  static propTypes = {
    videoRoom: videoRoomPropType.isRequired,
  };

  update = () => this.forceUpdate();

  render() {
    const { videoRoom } = this.props;
    const remoteParticipants = mapToArray(videoRoom.participants);

    return (
      <EventSubscriber
        events={EVENTS}
        eventEmitterObject={videoRoom}
        onUpdate={this.update}
      >
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
              Remote Video
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
        <Panel>
          <Panel.Block paddingless={!isEmpty(remoteParticipants)}>
            {!isEmpty(remoteParticipants)
              ? remoteParticipants.map(participant => (
                  <Participant
                    key={participant.sid}
                    participant={participant}
                  />
                ))
              : "No connected participants"}
          </Panel.Block>
        </Panel>
      </EventSubscriber>
    );
  }
}

export default VideoRoom;