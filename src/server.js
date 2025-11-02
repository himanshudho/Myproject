// server.js
const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const chatHandler = require('./chat'); // ✅ Chat logic file import


const PORT = process.env.PORT || 3000;

// ✅ Create HTTP server from express app
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = socketIo(server, {
  cors: { origin: '*' }
});

// ✅ Pass io to chat handler (so chat.js can use it)
chatHandler(io);


// ✅ Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
