'use client';
import "./../globals.css";
const io = require('socket.io-client')
import { useEffect, useState } from "react";

const Chat = (props) => {
  const socket = io('http://localhost:3001');
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    socket.emit("join_room", 'global', props.user);
    socket.on("message", (user, msg) => {
      setAllMessages((prevMessages) => [...prevMessages, {user: user, msg: msg}])
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  
  const sendMessage = () => {
    socket.emit("send_message", { room: "global", user: props.user, message: message });
    setMessage('')
  }
  
  const messageChange = (e) => {
    setMessage(e.target['value'])
  };
  
  const result = (<div className="chat">
    <div className="global-chat">{allMessages.map((elem, ind) => {
      const result = (<div 
        key={ind}
        className={elem['user'] === props.user ? 'user-message' : 'other-user-message'}>
          {elem['user'] !== props.user ? `${elem['user']}: ` : null} {elem['msg']}
        </div>)
      return result
    })}
    </div>
    <input
      className="global-chat-text-input"
          type="text"
          id="message"
          name="message"
          value={message}
          onKeyDown={(e) => {e.key === "Enter" && message !== '' ? sendMessage() : null}}
          onChange={messageChange}
          placeholder="Wyślij wiadomość..."
        />
  </div>)
  return (result);
};

export default Chat;
