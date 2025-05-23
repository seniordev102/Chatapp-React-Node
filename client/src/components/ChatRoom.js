import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, TextField, Button, Stack } from "@mui/material";
import io from "socket.io-client";
import MessageList from "./MessageList";

const SOCKET_SERVER_URL = "http://localhost:5000";

function ChatRoom({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    // Fetch existing messages
    fetch(`${SOCKET_SERVER_URL}/api/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data.reverse()))
      .catch((error) => console.error("Error fetching messages:", error));

    // Set up Socket.IO connection
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      senderId: userId,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <MessageList messages={messages} currentUserId={userId} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default ChatRoom;
