import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import ScrollToBottom from 'react-scroll-to-bottom';

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
        <h3>
          Hi {username}, you are connected to room: {roomName}
        </h3>
      </div>
      <div className="chat-window">
        <ul>
          <ScrollToBottom className="message-list">
            {messageList.map(messageData => (
              <li
                key={messageData.id}
                className={username === messageData.username ? 'you' : 'other'}
              >
                <div>
                  <h3>{messageData.message}</h3>
                </div>

                <div>
                  <small>
                    from: {messageData.username}
                    on: {messageData.createdAt}
                  </small>
                </div>
              </li>
            ))}
          </ScrollToBottom>
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
