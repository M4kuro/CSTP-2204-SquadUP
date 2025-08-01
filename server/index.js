const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config(); // Had to move .env inside the folder for deployment

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});
// Webhook route
const webhookRoutes = require("./routes/webhook");
app.use("/api/stripe/webhook", webhookRoutes);

// *** This is Middleware Setup
app.use(cors());
app.use(express.json());

// Route to main server
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 2000;

// *** Adding userRoutes (this is for discover, nearby etc)
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// *** Adding bookingRoutes (For the booking API)
const bookingRoutes = require("./routes/booking");
app.use("/api/bookings", bookingRoutes);

// *** Stripe payment routes (create-checkout-session)
const paymentRoutes = require("./routes/payments");
app.use("/api", paymentRoutes); // enables /api/create-checkout-session

// *** pass io to chat routes that need it
const chatRoutes = require("./routes/chat")(io);
app.use("/api/chat", chatRoutes);

// *** Serves uploaded images
app.use("/uploads", express.static("uploads"));

// ***** Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🔥 Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ***** Sample route
app.get("/", (req, res) => {
  res.send("Hello from SquadUP backend!");
});

// ***** UPDATED socket logic
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("🧠 New client connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`👤 User ${userId} joined with socket ID ${socket.id}`);
  });

  socket.on("sendMessage", ({ threadId, senderId, text }) => {
    console.log(`📨 Message from ${senderId}:`, text);

    // emit to all for now; in the future we can emit to specific socket IDs
    io.emit("receiveMessage", { threadId, senderId, text });
  });

  socket.on("disconnect", () => {
    console.log("💨 Client disconnected:", socket.id);

    // clean up from onlineUsers
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
  });
});

// This is the redirect after completing payment in stripe.
const path = require("path");

// Serve static frontend files from the dist folder
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all: serve index.html for any unknown route (for React Router)
app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
// ***** Start server
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
