'use client';
import "./../globals.css";
import { useEffect, useState } from "react";

const Chat = (props) => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    props.socket.emit("join_room_global", props.user);
    props.socket.on("message_global", (user, msg) => {
      setAllMessages((prevMessages) => [...prevMessages, {user: user, msg: msg}])
    });
    return () => {
      props.socket.disconnect();
    };
  }, []);
  
  const sendMessage = () => {
    setSendingMsg(true)
    props.socket.emit("send_message_global", { user: props.user, message: message })
    setMessage('')
    setTimeout(() => {
      setSendingMsg(false)
    }, 2000)
  } // ? Opóźnienie 2 sekundy na wysyłanie wiadomości, żeby ochronić przed spamem
    
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
    onKeyDown={(e) => {e.key === "Enter" && message !== '' && !sendingMsg ? sendMessage() : null}}
    onChange={messageChange}
    placeholder="Wyślij wiadomość..."
  />
  </div>)
  return (result);
};

export default Chat;
