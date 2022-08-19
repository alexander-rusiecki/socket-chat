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
        <p>
          Hi <span>{username}</span>, you are connected to room:{' '}
          <span>{roomName}</span>
        </p>
      </div>
      <div className="chat-window">
        <ul>
          <ScrollToBottom>
            {messageList.map(messageData => (
              <div
                key={messageData.id}
                className={
                  username === messageData.username
                    ? 'chat-list you'
                    : 'chat-list other'
                }
              >
                <li>
                  <div>
                    <h3>{messageData.message}</h3>
                  </div>

                  <div className="sender">
                    <small>
                      {messageData.username} | {messageData.createdAt}
                    </small>
                  </div>
                </li>
              </div>
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
