import React, { PureComponent } from "react";
import { Panel, Columns } from "react-bulma-components";
import { isEmpty } from "lodash";

import videoRoomPropType from "../../propTypes/videoRoom";
import Participant from "../Participant/Participant";
import LocalParticipant from "../Participant/LocalParticipant";
import EventSubscriber from "../EventSubscriber/EventSubscriber";
import { mapToArray } from "../../utils";

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
  "trackUnsubscribed"
];

class VideoRoom extends PureComponent {
  static propTypes = {
    videoRoom: videoRoomPropType.isRequired
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
        <Panel>
          <Panel.Header>Local Participant</Panel.Header>
          <Panel.Block paddingless>
            <LocalParticipant participant={videoRoom.localParticipant} />
          </Panel.Block>
        </Panel>
      </EventSubscriber>
    );
  }
}

export default VideoRoom;
