import React, { useState, useEffect, useRef } from 'react';

import { DOMAIN, AVATARS_URL } from '../Consts'

function Chat() {
  const MAX_MESSAGES = 150;

  const chatRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://${DOMAIN}:5555`);

    socket.onopen = function (event) {
      socketRef.current.send(JSON.stringify({"action": "join",
                                             "author": "GADJIIAVOV",
                                             "room_name": "stream-hashed-token-space-user-hashed-token"}));
      setIsConnected(true);
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages.slice(Math.max(-MAX_MESSAGES, -prevMessages.length)), data]);
    };

    socket.onclose = function (event) {
      setIsConnected(false);
    };

    socketRef.current = socket;

    return () => {
      socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById("chat");
    if (window.innerWidth < 1900) {
      chatContainer.scrollTop = 0;
    } else {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);


  function sendMessage() {
    const message = document.getElementById("messageInput").value;
    const data = {
            "action": "message",
            message
            };
    if (message) {
      socketRef.current?.send(JSON.stringify(data));
    }
    setInputValue("");
  }

  function sendMessageByKeydown(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  return (
    <>
      <p className="caption">Stream Chat</p>
      <div id="chat" className="chat" ref={chatRef}>
        <div className="messages">
          <p className="message">
            <small className="about rules">
              Chat rules:<br/>
              <span>1. Instead of making donations to the streamer, viewers should demand
              donations from the streamer for their entertainment.</span><br/>
              <span>2. Instead of subscribing to the channel, viewers should request
              that the streamer subscribe to their social media accounts.</span><br/>
              <span>3. Instead of sending positive and supportive messages in the chat,
              viewers should only send emoticons and meaningless phrases.</span><br/>
              <span>4. Instead of showing genuine excitement in exciting moments,
              viewers should remain completely unperturbed and uninterested.</span>
            </small>
          </p>
          {messages.map((message, index) => (
            <>
            {message.error ? null : (
               <p className="message" key={index}>
                 <span>
                   <img src={`${AVATARS_URL}6.png`} alt="" />
                 </span>
                 <div className="about">
                   <span className="author">{message.author}</span>
                   <span className="text">{message.message}</span>
                 </div>
               </p>
            )}
            </>
          ))}
        </div>

        <div className="input">
          <input
            id="messageInput"
            type="text"
            value={inputValue}
            onKeyDown={sendMessageByKeydown}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "The chat is loading. Wait..."}
            disabled={!isConnected}
          />
          <button onClick={sendMessage} disabled={!isConnected}>Send</button>
        </div>
      </div>
    </>
  );
}

export default Chat;