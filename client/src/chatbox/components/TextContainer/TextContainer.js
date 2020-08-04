import React, { Component } from 'react';

import onlineIcon from '../icons/onlineIcon.png';

import './TextContainer.css';

import Iframe from 'react-iframe'

export default class TextContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "width": (4 * 92.9) + "px",
      "height": (4 * 153) + "px",
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  resize(width,height) {
    console.log(width, height)
    this.setState({
      "width": (width * 92.9) + "px",
      "height": (height * 153) + "px",
    })
  }

 render() {
  const myurl = "https://wbo.ophir.dev/boards/snow" + this.props.room;

  return(
    <div className="textContainer">
      {/* <div>
        <h1>Realtime Chat Application <span role="img" aria-label="emoji">💬</span></h1>
        <h2>Created with React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h2>
        <h2>Try it out right now! <span role="img" aria-label="emoji">⬅️</span></h2>
      </div> */}
      {
        true
          ? (
            <div>
              <Iframe url={myurl}
                style="background: #FF5733;"
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
            </div>
            
          )
          : null
      }
    </div>
  );}
};