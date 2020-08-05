import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import Messages from '../Messages/Messages';
import Input from '../Input/Input';

import onlineIcon from '../icons/onlineIcon.png';
import './Chat.css';

let socket;

const Chat = ({ removeElement }) => {
  const name = localStorage.getItem('user');
  const room = localStorage.getItem('room');

  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'https://collaborative-classroom-server.herokuapp.com/';

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
        window.location.reload(false);
      }
    });
  }, [ENDPOINT]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="container">
      <div className="infoBar">
        <div className="leftInnerContainer">
          <img className="onlineIcon" src={onlineIcon} alt="online icon" />
          <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
          <span className={"delete-btn"}
                onClick={() => removeElement()}>
              X
          </span>
        </div>
      </div>

      <Messages messages={messages} name={name} />
      <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
      
  );
}

export default Chat;
