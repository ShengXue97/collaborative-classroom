(window["webpackJsonptwilio-screensharing-client"]=window["webpackJsonptwilio-screensharing-client"]||[]).push([[0],{147:function(e,t,a){e.exports={participant:"Participant_participant__I0-9e"}},152:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAHBJREFUGBmNkAEKwCAMA2VfGP2mrx3sOV2us6IymIXQGlNTW9zdhCqcZQm4dmelFUp+CZZa6sYpeUVIFyIixMqjCO51Wy5unQExuYSbSF5JASLqPsqRM21lOoWc89tagr3PSMgOiWlwnUeXWA/E78IfuAX270S3ydAAAAAASUVORK5CYII="},155:function(e,t,a){e.exports=a(368)},310:function(e,t){},346:function(e,t,a){},347:function(e,t,a){},348:function(e,t,a){},349:function(e,t,a){},350:function(e,t,a){},351:function(e,t,a){},365:function(e,t,a){},367:function(e,t,a){},368:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(18),c=a.n(o),i=a(27),s=(a(160),a(2)),l=a(4),u=a.n(l),m=u.a.shape({sid:u.a.string.isRequired,tracks:u.a.instanceOf(Map).isRequired}),p=(u.a.shape({localParticipant:m.isRequired,participants:u.a.instanceOf(Map).isRequired}),a(7)),d=a(8),h=a(10),v=a(9),f=a(15),b=(u.a.shape({attach:u.a.func.isRequired,kind:u.a.oneOf(["video","audio"]).isRequired}),function(e){Object(h.a)(a,e);var t=Object(v.a)(a);function a(){var e;Object(p.a)(this,a);for(var n=arguments.length,o=new Array(n),c=0;c<n;c++)o[c]=arguments[c];return(e=t.call.apply(t,[this].concat(o))).media=r.a.createRef(),e}return Object(d.a)(a,[{key:"componentDidMount",value:function(){this.props.track.attach(this.media.current)}},{key:"render",value:function(){var e=this.props.track;return r.a.createElement(e.kind,{autoPlay:!0,ref:this.media})}}]),a}(n.PureComponent)),g=function(e){return Array.from(e.values())},E=a(147),k=a.n(E),A=function(e){var t=e.participant;return r.a.createElement("div",{className:k.a.participant},g(t.tracks).map((function(e){return e.track&&r.a.createElement(b,{key:e.track.name,track:e.track})})))},y=function(e){Object(h.a)(a,e);var t=Object(v.a)(a);function a(){var e;Object(p.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).subscribeEvents=function(t){var a=e.props,n=a.events,r=a.onUpdate;n.forEach((function(e){return t.addListener(e,r)}))},e.unsubscribeEvents=function(t){var a=e.props,n=a.events,r=a.onUpdate;n.forEach((function(e){return t.removeListener(e,r)}))},e}return Object(d.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.eventEmitterObject;e&&this.subscribeEvents(e)}},{key:"componentDidUpdate",value:function(e){var t=this.props.eventEmitterObject;e.eventEmitterObject!==t&&(t?this.subscribeEvents(t):this.unsubscribeEvents(e.eventEmitterObject))}},{key:"componentWillUnmount",value:function(){var e=this.props.eventEmitterObject;e&&this.unsubscribeEvents(e)}},{key:"render",value:function(){return this.props.children}}]),a}(n.PureComponent);y.defaultProps={eventEmitterObject:null};var j,O=["trackPublished","trackPublicationFailed"],S=function(e){Object(h.a)(a,e);var t=Object(v.a)(a);function a(){var e;Object(p.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).update=function(){return e.forceUpdate()},e}return Object(d.a)(a,[{key:"render",value:function(){var e=this.props.participant;return r.a.createElement(y,{events:O,eventEmitterObject:e,onUpdate:this.update},r.a.createElement(A,{participant:e}))}}]),a}(n.PureComponent),C=["dominantSpeakerChanged","participantConnected","participantDisconnected","reconnected","reconnecting","trackDimensionsChanged","trackDisabled","trackEnabled","trackPublished","trackStarted","trackSubscribed","trackUnpublished","trackUnsubscribed"],N=function(e){Object(h.a)(a,e);var t=Object(v.a)(a);function a(){var e;Object(p.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).update=function(){return e.forceUpdate()},e}return Object(d.a)(a,[{key:"render",value:function(){var e=this.props.videoRoom;g(e.participants);return r.a.createElement(y,{events:C,eventEmitterObject:e,onUpdate:this.update},r.a.createElement(s.Panel,null,r.a.createElement(s.Panel.Header,null,"Local Participant"),r.a.createElement(s.Panel.Block,{paddingless:!0},r.a.createElement(S,{participant:e.localParticipant}))))}}]),a}(n.PureComponent),w=["dominantSpeakerChanged","participantConnected","participantDisconnected","reconnected","reconnecting","trackDimensionsChanged","trackDisabled","trackEnabled","trackPublished","trackStarted","trackSubscribed","trackUnpublished","trackUnsubscribed"],R=function(e){Object(h.a)(a,e);var t=Object(v.a)(a);function a(){var e;Object(p.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).update=function(){return e.forceUpdate()},e}return Object(d.a)(a,[{key:"render",value:function(){var e=this.props.videoRoom,t=g(e.participants);return r.a.createElement(y,{events:w,eventEmitterObject:e,onUpdate:this.update},r.a.createElement(s.Panel,null,r.a.createElement(s.Panel.Header,null,"Remote Participants"),r.a.createElement(s.Panel.Block,{paddingless:!Object(f.isEmpty)(t)},Object(f.isEmpty)(t)?"No connected participants":t.map((function(e){return r.a.createElement(A,{key:e.sid,participant:e})})))))}}]),a}(n.PureComponent),x=s.Form.Field,T=s.Form.Label,P=s.Form.Control,F=s.Form.Input,M=function(e){var t=e.value,a=e.name,n=e.label,o=e.placeholder,c=e.onChange;return r.a.createElement(x,{horizontal:!0},r.a.createElement(x.Label,{size:"normal"},r.a.createElement(T,null,n)),r.a.createElement(x.Body,null,r.a.createElement(x,null,r.a.createElement(P,null,r.a.createElement(F,{onChange:function(e){return c(e.target.value)},name:a,placeholder:o,value:t})))))},U=a(13),D=a.n(U),B=a(19),I=a(67),J=a(28),V=a.n(J),L=a(149),q=a.n(L),z=function(){var e=Object(B.a)(D.a.mark((function e(t){return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",q.a.get("https://collaborative-classroom-server.herokuapp.com/token",{params:{user:t}}));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),Q=function(e){Object(h.a)(a,e);var t=Object(v.a)(a);function a(){var e;Object(p.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={videoRoom:null,isJoining:!1,userName:"",roomName:"",errorMessage:null},e.getToken=Object(B.a)(D.a.mark((function t(){var a,n;return D.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.state.userName,t.next=3,z(a);case 3:return n=t.sent,t.abrupt("return",n.data.token);case 5:case"end":return t.stop()}}),t)}))),e.joinRoom=Object(B.a)(D.a.mark((function t(){var a,n,r,o,c;return D.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.state.roomName,e.setState({isJoining:!0}),t.prev=2,t.next=5,e.getToken();case 5:return n=t.sent,t.next=8,V.a.createLocalVideoTrack();case 8:return r=t.sent,e.setState({localVideoTrack:r}),t.next=12,V.a.createLocalAudioTrack();case 12:return o=t.sent,e.setState({localAudioTrack:o}),t.next=16,V.a.connect(n,{name:a,tracks:[r,o],insights:!1});case 16:(c=t.sent).on("disconnected",(function(){e.stopVideoTrack(),e.stopAudioTrack(),e.stopScreenTrack(),e.setState({videoRoom:null})})),e.setState({videoRoom:c}),t.next=26;break;case 21:t.prev=21,t.t0=t.catch(2),e.stopVideoTrack(),e.stopAudioTrack(),e.setState({errorMessage:t.t0.message});case 26:e.setState({isJoining:!1});case 27:case"end":return t.stop()}}),t,null,[[2,21]])}))),e.leaveRoom=Object(B.a)(D.a.mark((function t(){var a;return D.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(a=e.state.videoRoom)&&a.disconnect();case 2:case"end":return t.stop()}}),t)}))),e.stopTrack=function(t){var a=e.state[t];a&&(a.stop(),e.setState({[t]:null}))},e.stopScreenTrack=function(){return e.stopTrack("screenTrack")},e.stopVideoTrack=function(){return e.stopTrack("localVideoTrack")},e.stopAudioTrack=function(){return e.stopTrack("localAudioTrack")},e.shareScreen=Object(B.a)(D.a.mark((function t(){var a,n,r,o,c,i;return D.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,a=e.state,n=a.videoRoom,r=a.localVideoTrack,o=a.screenTrack){t.next=12;break}return t.next=5,navigator.mediaDevices.getDisplayMedia({video:!0});case 5:c=t.sent,i=Object(f.first)(c.getVideoTracks()),e.setState({screenTrack:new V.a.LocalVideoTrack(i)}),n.localParticipant.publishTrack(i),n.localParticipant.unpublishTrack(r),t.next=15;break;case 12:n.localParticipant.unpublishTrack(o),n.localParticipant.publishTrack(r),e.stopScreenTrack();case 15:t.next=21;break;case 17:t.prev=17,t.t0=t.catch(0),e.stopScreenTrack(),e.setState({errorMessage:t.t0.message});case 21:case"end":return t.stop()}}),t,null,[[0,17]])}))),e.hideErrorMessage=function(){return e.setState({errorMessage:null})},e.changeUserName=function(t){return e.setState({userName:t})},e.changeRoomName=function(t){return e.setState({roomName:t})},e}return Object(d.a)(a,[{key:"componentDidMount",value:function(){"firefox"===I.a.browserDetails.browser&&I.a.browserShim.shimGetDisplayMedia(window,"screen")}},{key:"render",value:function(){var e=this.props.render,t=this.state,a=t.videoRoom,n=t.isJoining,r=t.userName,o=t.roomName,c=t.errorMessage,i=t.screenTrack;return e({videoRoom:a,userName:r,roomName:o,isVideoSupported:V.a.isSupported,isScreenSharingSupported:Boolean(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia),isScreenSharingEnabled:Boolean(i),canJoin:!Object(f.isEmpty)(r)&&!Object(f.isEmpty)(o),isJoining:n,onJoin:this.joinRoom,onLeave:this.leaveRoom,onShare:this.shareScreen,onRoomNameChange:this.changeRoomName,onUserNameChange:this.changeUserName,errorMessage:c,onErrorMessageHide:this.hideErrorMessage})}}]),a}(n.PureComponent),W=a(154),Y=a(150),K=a.n(Y),G=a(151),H=a.n(G),X=(a(346),a(65)),Z=a.n(X),_=function(e){var t=e.message,a=t.text,n=t.user,o=!1,c=e.name.trim().toLowerCase();return n===c&&(o=!0),o?r.a.createElement("div",{className:"messageContainer justifyEnd"},r.a.createElement("p",{className:"sentText pr-10"},c),r.a.createElement("div",{className:"messageBox backgroundBlue"},r.a.createElement("p",{className:"messageText colorWhite"},Z.a.emojify(a)))):r.a.createElement("div",{className:"messageContainer justifyStart"},r.a.createElement("div",{className:"messageBox backgroundLight"},r.a.createElement("p",{className:"messageText colorDark"},Z.a.emojify(a))),r.a.createElement("p",{className:"sentText pl-10 "},n))},$=(a(347),function(e){var t=e.messages,a=e.name;return r.a.createElement(H.a,{className:"messages"},t.map((function(e,t){return r.a.createElement("div",{key:t},r.a.createElement(_,{message:e,name:a}))})))}),ee=a(64),te=a.n(ee),ae=a(152),ne=a.n(ae),re=(a(348),function(e){var t=e.room;return r.a.createElement("div",{className:"infoBar"},r.a.createElement("div",{className:"leftInnerContainer"},r.a.createElement("img",{className:"onlineIcon",src:te.a,alt:"online icon"}),r.a.createElement("h3",null,t)),r.a.createElement("div",{className:"rightInnerContainer"},r.a.createElement("a",{href:"/"},r.a.createElement("img",{src:ne.a,alt:"close icon"}))))}),oe=(a(349),function(e){var t=e.setMessage,a=e.sendMessage,n=e.message;return r.a.createElement("form",{className:"form"},r.a.createElement("input",{className:"input",type:"text",placeholder:"Type a message...",value:n,onChange:function(e){var a=e.target.value;return t(a)},onKeyPress:function(e){return"Enter"===e.key?a(e):null}}),r.a.createElement("button",{className:"sendButton",onClick:function(e){return a(e)}},"Send"))}),ce=(a(350),function(e){var t=e.name,a=e.room,o=Object(n.useState)(""),c=Object(i.a)(o,2),s=(c[0],c[1]),l=Object(n.useState)(""),u=Object(i.a)(l,2),m=u[0],p=u[1],d=Object(n.useState)([]),h=Object(i.a)(d,2),v=h[0],f=h[1],b="https://collaborative-classroom-server.herokuapp.com/";Object(n.useEffect)((function(){(j=K()(b)).emit("join",{name:t,room:a},(function(e){e&&alert(e)}))}),[b]),Object(n.useEffect)((function(){j.on("message",(function(e){f((function(t){return[].concat(Object(W.a)(t),[e])}))})),j.on("roomData",(function(e){var t=e.users;s(t)}))}),[]);return r.a.createElement("div",{className:"container"},r.a.createElement(re,{room:a}),r.a.createElement($,{messages:v,name:t}),r.a.createElement(oe,{message:m,setMessage:p,sendMessage:function(e){e.preventDefault(),m&&j.emit("sendMessage",m,(function(){return p("")}))}}))}),ie=(a(351),a(153)),se=function(e){Object(h.a)(a,e);var t=Object(v.a)(a);function a(e){var n;return Object(p.a)(this,a),(n=t.call(this,e)).state={width:"371.6px",height:"612px"},n}return Object(d.a)(a,[{key:"componentDidMount",value:function(){this.props.onRef(this)}},{key:"componentWillUnmount",value:function(){this.props.onRef(void 0)}},{key:"resize",value:function(e,t){console.log(e,t),this.setState({width:92.9*e+"px",height:153*t+"px"})}},{key:"render",value:function(){var e="https://wbo.ophir.dev/boards/snow"+this.props.room;return r.a.createElement("div",{style:{background:"#FFF9AA"}},r.a.createElement("div",null,r.a.createElement(ie.a,{url:e,style:"background: #FFF9AA;",width:this.state.width,height:this.state.height,id:"myId",className:"myClassname",display:"initial",position:"relative"})))}}]),a}(n.Component),le=(a(352),a(353),a(66)),ue=a.n(le),me=(a(365),Object(le.WidthProvider)(ue.a)),pe=function(e){var t=e.videoRoom,a=e.userName,o=e.roomName,c=e.isJoining,l=e.isVideoSupported,u=e.isScreenSharingSupported,m=e.isScreenSharingEnabled,p=e.canJoin,d=e.onJoin,h=e.onLeave,v=e.onShare,f=e.onUserNameChange,b=e.onRoomNameChange,g=e.errorMessage,E=e.onErrorMessageHide,k=null,A=Object(n.useState)(""),y=Object(i.a)(A,2),j=y[0],O=y[1];return k=l?t?r.a.createElement(r.a.Fragment,null,r.a.createElement(me,{autoSize:"true",className:"layout",onResize:function(e){var t=e[0].w,a=e[0].h;j.resize(t,a)}},r.a.createElement("div",{style:{background:"#FFD5B8"},key:"1","data-grid":{x:0,y:0,w:4,h:4}},r.a.createElement(se,{onRef:function(e){return O(e)},room:o})),r.a.createElement("div",{style:{background:"#FFD5B8"},key:"2","data-grid":{x:4,y:0,w:4,h:2}},r.a.createElement(N,{videoRoom:t})),r.a.createElement("div",{style:{background:"#FFD5B8"},key:"3","data-grid":{x:4,y:2,w:4,h:2}},r.a.createElement(R,{videoRoom:t})),r.a.createElement("div",{style:{background:"#FFD5B8"},key:"4","data-grid":{x:8,y:0,w:4,h:4}},r.a.createElement(ce,{name:a,room:o}))),r.a.createElement(s.Form.Field,{kind:"group",align:"centered"},r.a.createElement(s.Form.Control,null,r.a.createElement(s.Button,{onClick:function(){return h()}},"Leave")),r.a.createElement(s.Form.Control,null,r.a.createElement(s.Button,{onClick:function(){return v()},disabled:!u},m?"Stop sharing":"Start sharing")))):r.a.createElement(s.Columns,null,r.a.createElement(s.Columns.Column,{size:"half",offset:"one-quarter"},r.a.createElement(M,{value:a,name:"userName",label:"User",placeholder:"The identifier of the user",onChange:f}),r.a.createElement(M,{value:o,name:"roomName",label:"Room",placeholder:"The name of the room that you want to join",onChange:b}),r.a.createElement(s.Form.Field,{kind:"group",align:"centered"},r.a.createElement(s.Form.Control,null,r.a.createElement(s.Button,{onClick:function(){return d()},loading:c,disabled:!p,color:"primary"},"Join"))))):r.a.createElement("div",null,"Video is not supported"),r.a.createElement("div",{style:{height:"1920px",width:"1300px"},id:"bgdiv"},r.a.createElement("h1",null,"Collaborative Classroom"),g&&r.a.createElement(s.Notification,{color:"danger"},"Error: ",g,r.a.createElement(s.Button,{onClick:E,remove:!0})),k)};pe.defaultProps={videoRoom:null,errorMessage:null};var de=function(e){return r.a.createElement(pe,e)},he=function(e){return r.a.createElement(Q,Object.assign({render:de},e))};a(366),a(367);c.a.render(r.a.createElement(he,null),document.getElementById("root"))},64:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAAXNSR0IArs4c6QAAAExJREFUCB1jbPh/le3lx5tNDIwMcQwg8J9hkTi/eh0LWJCBoRwoAAPlQDEGJrhKmDCIBupmQuYjs5lAZiILgNlAMRaQRSAz4UZCLQcAIwYaiAejKoYAAAAASUVORK5CYII="}},[[155,1,2]]]);