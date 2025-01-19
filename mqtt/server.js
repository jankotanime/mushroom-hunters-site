// ! TODO: Dodać bazę danych do projektu
// ! Aplikacja może nie działać przez dwa różne https. Najprawdopodobniej potrzebne jest wejście w przeglądarce
// ! na stronę serwera api i website. Dodawanie certyfikatów do przęglądarki nie zawsze jest skuteczne
// ! sudo systemctl restart mosquitto

import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import mqtt from 'mqtt';
import { Server } from 'socket.io';

const { Pool } = pkg;
const server = express();
const port = 8001;

server.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true, 
}));
const options = {
  key: fs.readFileSync('./certs/server.key'), 
  cert: fs.readFileSync('./certs/server.crt'),
};
const httpsServer = https.createServer(options, server)
const dataBaseURL = '192.168.0.13' // '10.231.25.216' domowy '192.168.0.13' // ? localhost nie dziala przez to ze db na razie jest na windowsie
const io = new Server(httpsServer, {cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "PAST", "DELETE"]
}})

server.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: dataBaseURL,
  database: 'postgres',
  password: 'piwo',
  port: 5432,
});

const client = mqtt.connect('mqtt://localhost:1883');

server.get('/mqtt/get-all-posts', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT content FROM posts",
    );
    res.status(201).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

const addPostToDB = async (user, content) => {
  try {
    const result = await pool.query(
      `INSERT INTO posts (id_user, content)
      SELECT id_user, $2 FROM users
      WHERE username = $1`, 
      [user, content]);
    result ? console.log('dodane na bd') : console.log('error') 
  } catch (error) {
    console.log(error)
  }
}

client.on('connect', () => {
  console.log('Połączono z brokerem MQTT');
});

client.on('message', (topic, message) => {
  addPostToDB(topic, message)
  io.to(topic).emit("message", {user: topic, content: message.toString()});
});

io.sockets.on("connection", (socket) => {
  socket.on("enter-dashboard", (user, friends) => {
    socket.userId = user;
    client.subscribe(user, (err) => {
      if (err) {
        console.log('Error:', err);;
      }
      console.log(`subskrypcja: ${user}`);
    })
    friends.forEach(friend => {
      socket.join(friend.username)
      console.log(`${user} widzi posty: ${friend.username}`)
      client.subscribe(friend.username, (err) => {
        if (err) {
          console.log('Error:', err);;
        }
        console.log(`subskrypcja: ${friend.username}`);
      })
    });


  })
})

httpsServer.listen(port, () => {
  console.log(`Serwer działa na https://localhost:${port}`);
});
