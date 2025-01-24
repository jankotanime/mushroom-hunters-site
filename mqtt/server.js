// ! włączenie brockera: sudo systemctl restart mosquitto

import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import mqtt from 'mqtt';
import { Server } from 'socket.io';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { stringify } from 'querystring';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;
const server = express();
const port = 8001;

server.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true, 
}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
server.use(cookieParser())

const options = {
  key: fs.readFileSync('./certs/server.key'), 
  cert: fs.readFileSync('./certs/server.crt'),
};
const httpsServer = https.createServer(options, server)
const dataBaseURL = '' // ip bazy danych
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const client = mqtt.connect('mqtt://localhost:1883');

const verifyAuthToken = (req, res, next) => {
  const token = req.cookies.loggedIn;
  const userCookie = req.cookies.user;
  if (!token || !userCookie) {
    res.setHeader(
      'Set-Cookie', [
        `loggedIn=false; Max-Age=0; Path=/; SameSite=None; httpOnly; Secure;`,
        `user=false; Max-Age=0; Path=/; SameSite=None; httpOnly; Secure;`
      ]
    );
    return res.status(403).json({ error: 'Problem z autoryzacją!' });
  }
  const secretKey = process.env.JWT_SECRET || 'sektret Victorii';
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err || decoded.login !== userCookie) {
      res.setHeader(
        'Set-Cookie', [
          `loggedIn=false; Max-Age=0; Path=/; SameSite=None; httpOnly; Secure;`,
          `user=false; Max-Age=0; Path=/; SameSite=None; httpOnly; Secure;`
        ]
      );
      return res.status(403).json({ error: 'Problem z autoryzacją!' });
    }
    req.user = decoded;  
    next();
  });
};

server.get('/mqtt/get-all-posts', verifyAuthToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.username, posts.content, posts.img FROM posts
      JOIN users ON posts.id_user = users.id_user WHERE users.username != $1`,
      [req.query.user]
    );

    res.status(201).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

server.get('/mqtt/get-user-posts', verifyAuthToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.id_post, users.username, posts.content, posts.img FROM posts
      JOIN users ON posts.id_user = users.id_user WHERE users.username = $1`,
      [req.query.user]
    );

    res.status(201).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

server.post('/mqtt/send-post', verifyAuthToken, upload.single('image'), async (req, res) => {
  const user = req.body.user;
  const content = req.body.content;
  const img = req.file || null;
  try {
    let data = null 
    if (img) {
      data = {content: content, img: `/uploads/${img.filename}`}
    } else {
      data = {content: content, img: null}
    }
    client.publish(user, JSON.stringify(data))
    const result = await pool.query(
      `INSERT INTO posts (id_user, content, img) SELECT id_user, $2, $3
      FROM users WHERE username = $1`,
      [user, content, data.img]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

server.delete('/mqtt/delete-post', verifyAuthToken, async (req, res) => {
  try{
    const id = req.body.id;
    const result = await pool.query(
      `DELETE FROM posts WHERE id_post = $1`,
      [id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

client.on('connect', () => {
  console.log('Połączono z brokerem MQTT');
});

client.on('message', (topic, message) => {
  let receivedData = JSON.parse(message.toString());
  io.to(topic).emit("message", {username: topic, content: receivedData.content, img: receivedData.img});
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
