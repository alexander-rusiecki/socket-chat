import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

function Chat({ socket, username, roomName }) {
  const [chatMessage, setChatMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  async function sendMessage(e) {
    e.preventDefault();
    if (chatMessage !== '') {
      const messageData = {
        username,
        roomName,
        message: chatMessage,
        createdAt: `${new Date().getHours()}:${new Date().getMinutes()}`,
        id: nanoid(),
      };
      await socket.emit('send-message', messageData);
      setMessageList(prev => [...prev, messageData]);
      setChatMessage('');
    }
  }

  useEffect(() => {
    socket.on('receive-message', data => {
      setMessageList(prev => [...prev, data]);
    });
  }, [socket]);

  return (
    <div className="chat-box">
      <div className="chat-header">
        <p>Connected to room: 1</p>
        <p>User ID: 13</p>
      </div>
      <div className="chat-window">
        <ul>
          {messageList.map(messageData => (
            <li
              key={messageData.id}
              className={username === messageData.username ? 'you' : 'other'}
            >
              <div>
                <p>{messageData.username}</p>
              </div>
              <div>
                <h3>{messageData.message}</h3>
              </div>
              <div>
                <small>{messageData.createdAt}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendMessage}>
        <textarea
          name="chat"
          id="chat"
          value={chatMessage}
          onChange={e => setChatMessage(e.target.value)}
        />
        <button>SEND</button>
      </form>
    </div>
  );
}

export default Chat;
