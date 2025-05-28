const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ***** Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('🔥 Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ***** Sample route
app.get('/', (req, res) => {
  res.send('Hello from SquadUP backend!');
});

// ***** Sample socket logic
io.on('connection', (socket) => {
  console.log('🧠 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('💨 Client disconnected:', socket.id);
  });
});

// ***** Start server
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
