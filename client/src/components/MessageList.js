import React, { useEffect, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";

function MessageList({ messages, currentUserId }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        p: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;

        return (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              justifyContent: isCurrentUser ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: "70%",
                backgroundColor: isCurrentUser ? "#1976d2" : "white",
                color: isCurrentUser ? "white" : "black",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  color: isCurrentUser
                    ? "rgba(255, 255, 255, 0.7)"
                    : "text.secondary",
                }}
              >
                {new Date(message.created_at).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>
  );
}

export default MessageList;
