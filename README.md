# Real-Time Chat Application

A minimalistic real-time chat web application built with React, Node.js, MySQL, and Socket.IO.

## Features

- Real-time messaging using WebSocket
- User messages displayed on left (received) and right (sent)
- Clean and intuitive user interface
- Persistent message storage using MySQL

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MySQL
- Real-time Communication: Socket.IO

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Project Structure

```
chatapp/
├── client/           # React frontend
├── server/           # Node.js backend
└── db/              # Database scripts
```

## Setup Instructions

1. Clone the repository
2. Set up the database:
   ```bash
   cd db
   mysql -u your_username -p < schema.sql
   ```

3. Set up the backend:
   ```bash
   cd server
   npm install
   # Create a .env file with your configuration
   npm start
   ```

4. Set up the frontend:
   ```bash
   cd client
   npm install
   npm start
   ```

5. Access the application at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=chatapp
PORT=5000
```

## Development Notes

This project was developed as part of a technical assessment. The development process included:
- Setting up the basic project structure
- Implementing the backend API with Node.js and Express
- Creating the frontend UI with React
- Integrating Socket.IO for real-time communication
- Setting up MySQL database for message persistence

## License

MIT
