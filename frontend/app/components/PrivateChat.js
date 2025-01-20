'use client';
import "./../globals.css";
import { useEffect, useState } from "react";

const PrivateChat = (props) => {
  let usedEffect = false;
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [sendingMsg, setSendingMsg] = useState(false);
  
  useEffect(() => {
    setAllMessages([])
    usedEffect ? null : props.socket.emit("join_room_private", props.user, props.roommate);
    usedEffect = true
    props.socket.on("message_private", (user, msg) => {
      setAllMessages((prevMessages) => [...prevMessages, {user: user, msg: msg}])
    });
    return () => {
      props.socket.off("message_private");
    };
  }, []);
  
  const sendMessage = () => {
    setSendingMsg(true)
    props.socket.emit("send_message_private", { user: props.user, roommate: props.roommate, message: message })
    setMessage('')
    setTimeout(() => {
      setSendingMsg(false)
    }, 2000)
  } // ? Opóźnienie 2 sekundy na wysyłanie wiadomości, żeby ochronić przed spamem
    
  const messageChange = (e) => {
    setMessage(e.target['value'])
  };
    
  const result = (<div className="private-chat">
    {props.roommate}
  <div className="private-chat-scroll">{allMessages.map((elem, ind) => {
    const result = (<div 
      key={ind}
      className={elem['user'] === props.user ? 'user-message' : 'other-user-message'}>
        {elem['user'] !== props.user ? `${elem['user']}: ` : null} {elem['msg']}
      </div>)
    return result
   })}
  </div>
  <input
    type="text"
    id="message"
    name="message"
    value={message}
    onKeyDown={(e) => {e.key === "Enter" && message !== '' && !sendingMsg ? sendMessage() : null}}
    onChange={messageChange}
    placeholder="Wyślij wiadomość..."
  />
  </div>)
  return (result);
};

export default PrivateChat;
