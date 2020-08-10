import { PureComponent } from "react";
import PropTypes from "prop-types";
import adapter from "webrtc-adapter";
import TwilioVideo from "twilio-video";
import { isEmpty, first } from "lodash";

import { getToken } from "../../api";

import io from "socket.io-client";
let socket;
const ENDPOINT = "https://collaborative-classroom-server.herokuapp.com/";

class AppContainer extends PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired,
  };

  state = {
    videoRoom: null,
    isJoining: false,
    userName: "",
    roomName: "",
    errorMessage: null,
    audioChecked: true,
    videoChecked: true,
    tracks: [],
  };

  componentDidMount() {
    if (adapter.browserDetails.browser === "firefox") {
      adapter.browserShim.shimGetDisplayMedia(window, "screen");
    }
  }

  getToken = async () => {
    const userName = localStorage.getItem("user");

    const response = await getToken(userName);

    return response.data.token;
  };

  joinRoom = async () => {
    const userName = localStorage.getItem("user");
    const roomName = localStorage.getItem("room");
    this.setState({ isJoining: true });

    try {
      const token = await this.getToken();
      var localAudioTrack = null;
      var localVideoTrack = null;

      if (this.state.audioChecked) {
        try {
          localAudioTrack = await TwilioVideo.createLocalAudioTrack();
          this.setState({ localAudioTrack });
        } catch {}
      }

      if (this.state.videoChecked) {
        try {
          localVideoTrack = await TwilioVideo.createLocalVideoTrack();
          this.setState({ localVideoTrack });
        } catch {}
      }

      if (localAudioTrack != null) {
        this.state.tracks.push(localAudioTrack);
      }

      if (localVideoTrack != null) {
        this.state.tracks.push(localVideoTrack);
      }

      const videoRoom = await TwilioVideo.connect(token, {
        name: roomName,
        audio: false,
        video: false,
        tracks: this.state.tracks,
        insights: false,
      });

      console.log(videoRoom);

      videoRoom.on("disconnected", () => {
        this.stopVideoTrack();
        this.stopAudioTrack();
        this.stopScreenTrack();

        this.setState({
          videoRoom: null,
        });
      });

      this.setState({ videoRoom });
    } catch (error) {
      this.stopVideoTrack();
      this.stopAudioTrack();

      this.setState({
        errorMessage: error.message,
      });
    }

    this.setState({ isJoining: false });
  };

  leaveRoom = async () => {
    const { videoRoom } = this.state;
    socket = io(ENDPOINT);
    // Subscribe to disconnect event once you know you are connected
    console.log("leave");
    socket.emit("end", () => {});

    // Now disconnect once you are connected
    socket.disconnect();

    if (videoRoom) {
      videoRoom.disconnect();
    }
  };

  stopTrack = trackName => {
    const track = this.state[trackName];

    if (track) {
      track.stop();
      this.setState({ [trackName]: null });
    }
  };

  stopScreenTrack = () => this.stopTrack("screenTrack");

  stopVideoTrack = () => this.stopTrack("localVideoTrack");

  stopAudioTrack = () => this.stopTrack("localAudioTrack");

  shareScreen = async () => {
    try {
      const { videoRoom, localVideoTrack, screenTrack } = this.state;

      if (!screenTrack) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const newScreenTrack = first(stream.getVideoTracks());

        this.setState({
          screenTrack: new TwilioVideo.LocalVideoTrack(newScreenTrack),
        });

        videoRoom.localParticipant.publishTrack(newScreenTrack);
        videoRoom.localParticipant.unpublishTrack(localVideoTrack);
      } else {
        videoRoom.localParticipant.unpublishTrack(screenTrack);
        videoRoom.localParticipant.publishTrack(localVideoTrack);
        this.stopScreenTrack();
      }
    } catch (error) {
      this.stopScreenTrack();

      this.setState({
        errorMessage: error.message,
      });
    }
  };

  hideErrorMessage = () => this.setState({ errorMessage: null });

  changeUserName = userName => this.setState({ userName });

  changeRoomName = roomName => {
    localStorage.setItem("room", roomName);
    this.setState({ roomName });
  };

  onAudioCheckedChange = async () => {
    try {
      if (this.state.audioChecked) {
        this.state.localAudioTrack.disable();
      } else {
        this.state.localAudioTrack.enable();
      }
    } catch (e) {
      //console.log(e);
    }
    this.setState({ audioChecked: !this.state.audioChecked });
  };

  onVideoCheckedChange = async () => {
    try {
      if (this.state.videoChecked) {
        this.state.localVideoTrack.disable();
      } else {
        this.state.localVideoTrack.enable();
      }
    } catch (e) {
      //console.log(e);
    }
    this.setState({ videoChecked: !this.state.videoChecked });
  };

  render() {
    const { render } = this.props;
    const {
      videoRoom,
      isJoining,
      userName,
      roomName,
      errorMessage,
      screenTrack,
    } = this.state;

    return render({
      videoRoom,
      userName,
      roomName,
      isVideoSupported: TwilioVideo.isSupported,
      isScreenSharingSupported: Boolean(
        navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia,
      ),
      isScreenSharingEnabled: Boolean(screenTrack),
      canJoin: true,
      isJoining,
      onJoin: this.joinRoom,
      onLeave: this.leaveRoom,
      onShare: this.shareScreen,
      onRoomNameChange: this.changeRoomName,
      onUserNameChange: this.changeUserName,
      errorMessage,
      onErrorMessageHide: this.hideErrorMessage,
      audioChecked: this.state.audioChecked,
      videoChecked: this.state.videoChecked,
      onAudioCheckedChange: this.onAudioCheckedChange,
      onVideoCheckedChange: this.onVideoCheckedChange,
    });
  }
}

export default AppContainer;
