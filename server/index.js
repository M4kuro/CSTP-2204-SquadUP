const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config(); // Had to move .env inside the folder for deployment

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

// *** This is Middleware Setup 

app.use(cors());
app.use(express.json());

// Route to main server
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// *** Adding userRoutes (this is for discover, nearby etc)
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// *** Serves uploaded images
app.use('/uploads', express.static('uploads'));


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
