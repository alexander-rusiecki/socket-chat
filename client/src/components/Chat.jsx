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
          {messageList.map(message => (
            <li key={message.id}>{message.message}</li>
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
