import React from 'react';

import onlineIcon from '../icons/onlineIcon.png';

import './TextContainer.css';

import Iframe from 'react-iframe'

const TextContainer = ({ users, room }) => {
  const myurl = "https://wbo.ophir.dev/boards/snow" + room;

  return(
    <div className="textContainer">
      {/* <div>
        <h1>Realtime Chat Application <span role="img" aria-label="emoji">💬</span></h1>
        <h2>Created with React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h2>
        <h2>Try it out right now! <span role="img" aria-label="emoji">⬅️</span></h2>
      </div> */}
      {
        users
          ? (
            <div>
              <Iframe url={myurl}
                style="background: #FF5733;"
                width="450px"
                height="450px"
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
  );
};

export default TextContainer;