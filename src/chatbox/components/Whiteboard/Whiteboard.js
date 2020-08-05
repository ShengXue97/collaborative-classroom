import React, { Component, Fragment } from 'react';
import { MDBBtn, MDBIcon } from "mdbreact";

import onlineIcon from '../icons/onlineIcon.png';

import closeIcon from '../icons/closeIcon.png';

import './Whiteboard.css';

import Iframe from 'react-iframe'

import {
  Card,
  CardHeader,
  CardTitle,
  CardImg,
  CardBody,
  CardFooter,
  Button
} from "shards-react";

export default class Whiteboard extends Component {
  constructor(props) {
    super(props);
    const str = '#whiteboard'
    var tempWidth = (4 * 65) + "px";
    var tempHeight = (4 * 160) + "px";

    this.state = {
      "width": tempWidth,
      "height": tempHeight,
    }
  }

  componentDidMount() {
    this.props.onRef(this)

    const str = '#whiteboard'

    if (document.querySelector(str) != null){
      var tempWidth = getComputedStyle(document.querySelector(str)).width.replace("px","")
      var tempHeight = getComputedStyle(document.querySelector(str)).height.replace("px","")
      this.setState({
        "width": (parseInt(tempWidth,10)) + "px",
        "height": (parseInt(tempHeight,10)- 35) + "px",
      })
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  resize(snap) {
    var str = '.react-grid-item.react-grid-placeholder.cssTransforms.react-resizable-hide.react-resizable'
    if (!snap){
      str = '#whiteboard'
    }

    if (document.querySelector(str) != null){
      var tempWidth = getComputedStyle(document.querySelector(str)).width.replace("px","")
      var tempHeight = getComputedStyle(document.querySelector(str)).height.replace("px","")
      this.setState({
        "width": (parseInt(tempWidth,10)) + "px",
        "height": (parseInt(tempHeight,10)- 35) + "px",
      })
    }
    
  }

 render() {
  const myurl = "https://wbo.ophir.dev/boards/snow" + this.props.room;

  return(
    <div style={{"background": "#FFF9AA"}}>

      {/* <div>
        <h1>Realtime Chat Application <span role="img" aria-label="emoji">💬</span></h1>
        <h2>Created with React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h2>
        <h2>Try it out right now! <span role="img" aria-label="emoji">⬅️</span></h2>
      </div> */}
      {
        true
          ? (
            <div>
              <Card>
                <CardHeader>Card header</CardHeader>
                <CardBody>
                  <Iframe url={myurl}
                  style="background: #FFF9AA;"
                  width={this.state.width}
                  height={this.state.height}
                  id="myId"
                  className="myClassname"
                  display="initial"
                  position="relative"/>

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
                </CardBody>
              </Card>
            </div>
            
          )
          : null
      }
    </div>
  );}
};