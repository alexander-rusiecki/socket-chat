import { useState } from 'react';
import oi from 'socket.io-client';
import Chat from './components/Chat';

const socket = oi('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = e => {
    e.preventDefault();
    if (username !== '' && roomName !== '') {
      socket.emit('join-room', { username, roomName }, error => {
        if (error) {
          alert(error);
        }
      });
      setShowChat(true);
    }
  };

  return (
    <>
      {!showChat ? (
        <div className="join">
          <h1>Join a room</h1>
          <form onSubmit={joinRoom}>
            <input
              type="text"
              placeholder="username"
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="room name"
              onChange={e => setRoomName(e.target.value)}
            />
            <button>JOIN</button>
          </form>
        </div>
      ) : (
        <Chat socket={socket} username={username} roomName={roomName} />
      )}
    </>
  );
}

export default App;
