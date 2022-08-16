import { useState } from 'react';
import oi from 'socket.io-client';
const socket = oi('http://localhost:4000');

function App() {
  const [chatMessage, setChatMessage] = useState('');
  function sendMsg(e) {
    e.preventDefault();
    socket.emit('chat message', { chatMessage });
  }
  return (
    <div>
      <h1>Chat app</h1>
      <form onSubmit={sendMsg}>
        <input
          type="text"
          name="chat"
          id="chat"
          placeholder="message"
          onChange={e => setChatMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
