# Mushroom Hunters Site
### Version: 1.0

**Mushroom Hunters Site** is a lightweight social media platform for mushroom enthusiasts, featuring global chat, private messaging, and post sharing. Built with Next.js and PostgreSQL it enables real-time communication and hot post updates—posts refresh instantly via MQTT, while chats run smoothly through WebSocket connections. [Go to preview](#preview)

---

## Requirements
- MQTT docker
- Node.js
- PostgreSQL v17

## Features
- **Register and Login** - Access validation with token-based cookies. 
- **MQTT** - Real-time posts managment and its functionality.
- **WebSockets** - Global chat for all users, private messaging between users and frontend-to-mqtt communication.
- **Security** - User authorization, tls, certificates and password hashing.
- **Postgres** - database to manage users, friendships and posts.

## Setup Instructions

### 1. Database Setup
1. Make sure you have PostgreSQL version 17 or higher installed
2. Import the `database.sql` file into your PostgreSQL server (e.g., using `psql -U postgres -f database.sql`)
3. Start your PostgreSQL server and ensure it's running
### 2. Running the Application
1. In each `server.js` file, update the IP address to match your machine’s local IPv4 address
2. Update the PostgreSQL connection IP to point to your actual database host
3. In the frontend folder, run the following in your terminal  `export NODE_TLS_REJECT_UNAUTHORIZED=0`
4. In each server folder (frontend, backend, etc.), run: `node server.js` (Keep each terminal open and do not stop the servers)
5. Open your browser and go to: https://localhost:3000

## Preview
![Zrzut ekranu 2025-06-10 203350](https://github.com/user-attachments/assets/2d0ace1a-6011-4f9e-b537-fd2c114b1f50)
![Zrzut ekranu 2025-06-10 203153](https://github.com/user-attachments/assets/976afd5d-c5d1-49c6-aa46-7fd875950636)
![Zrzut ekranu 2025-06-10 205134](https://github.com/user-attachments/assets/216a70a7-d7f5-4cf9-a36f-6f2edf0cb8fb)
