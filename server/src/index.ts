import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createConnection, RowDataPacket } from "mysql2/promise";
import { Connection } from "mysql2/promise";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

interface DatabaseConfig {
  host: string;
  user: string;
  password: string | undefined;
  database: string;
}

interface Message extends RowDataPacket {
  id?: number;
  senderId: string;
  content: string;
  created_at?: Date;
}

// Database connection
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "chatapp",
};

let db: Connection;

async function initializeDb(): Promise<void> {
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

  socket.on("sendMessage", async (message: Message) => {
    try {
      // Store message in database
      const [result] = await db.execute(
        "INSERT INTO messages (sender_id, content) VALUES (?, ?)",
        [message.senderId, message.content]
      );

      const newMessage: Message = {
        id: (result as any).insertId,
        senderId: message.senderId,
        content: message.content,
        created_at: new Date(),
      } as Message; // Type assertion needed because of RowDataPacket

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
app.get("/api/messages", async (_req: Request, res: Response) => {
  try {
    const [messages] = await db.execute<Message[]>(
      "SELECT * FROM messages ORDER BY created_at DESC LIMIT 50"
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer(): Promise<void> {
  await initializeDb();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
