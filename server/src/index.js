require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { createConnection } = require("mysql2/promise");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "chatapp",
};

let db;

async function initializeDb() {
  try {
    db = await createConnection(dbConfig);
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", async (message) => {
    try {
      // Store message in database
      const [result] = await db.execute(
        "INSERT INTO messages (sender_id, content) VALUES (?, ?)",
        [message.senderId, message.content]
      );

      const newMessage = {
        id: result.insertId,
        senderId: message.senderId,
        content: message.content,
        created_at: new Date(),
      };

      // Broadcast message to all connected clients
      io.emit("message", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// API Routes
app.get("/api/messages", async (req, res) => {
  try {
    const [messages] = await db.execute(
      "SELECT * FROM messages ORDER BY created_at DESC LIMIT 50"
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await initializeDb();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
