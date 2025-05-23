import React, { useState, useEffect } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import ChatRoom from "./components/ChatRoom";
import { v4 as uuidv4 } from "uuid";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App: React.FC = () => {
  const [userId] = useState<string>(() => {
    const savedUserId = localStorage.getItem("chatUserId");
    return savedUserId || uuidv4();
  });

  useEffect(() => {
    localStorage.setItem("chatUserId", userId);
  }, [userId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ height: "100vh", py: 2 }}>
        <ChatRoom userId={userId} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
