// ! TODO: Dodać bazę danych do projektu

// ! Aplikacja może nie działać przez dwa różne https. Najprawdopodobniej potrzebne jest wejście w przeglądarce
// ! na stronę serwera api i website. Dodawanie certyfikatów do przęglądarki nie zawsze jest skuteczne

import express from 'express';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import cors from 'cors';
import findingByLogin from './finding.js';
import https from 'https';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;

const server = express();
const port = 8000;

const options = {
  key: fs.readFileSync('./certs/server.key'), 
  cert: fs.readFileSync('./certs/server.crt'),
};

const dataBaseURL = '192.168.0.13' // szkolny '10.10.4.153' domowy '192.168.0.13' // ? localhost nie dziala przez to ze db na razie jest na windowsie

server.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // ? Na przyszłość do ciasteczek
}));

server.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: dataBaseURL,
  database: 'postgres',
  password: 'piwo',
  port: 5432,
});

const isUserInDB = async (user) => {
  try {
    const result = await pool.query(
      'select count(id_user) from users where username=$1',
      [user]
    );
    return parseInt(result['rows'][0]['count'])
  } catch (error) {
    return error
  }
}

server.post('/api/register-user', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const freeUserName = await isUserInDB(username)
    if (freeUserName === 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
      );
      res.status(201).json(result.rows[0]);
    } else if (freeUserName >= 0) {
      res.status(409).json({ error: 'nazwa zajeta' });
    } else {
      res.status(500).json({ error: freeUserName.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateAuthToken(username) {
  const secretKey = process.env.JWT_SECRET || 'sektret Victorii'; // ? Może warto to na coś zmienić
  const payload = {
    login: username,
  };
  const options = {
    expiresIn: '720h'
  };
  const token = jwt.sign(payload, secretKey, options);
  return token;
}

server.post('/api/login-user', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username=$1',
      [username]
    );
    if (result.rows[0]) {
      const matchPass = await bcrypt.compare(password, result.rows[0].password);
      if (matchPass) {
        res.setHeader(
          'Set-Cookie',
          `loggedIn=${generateAuthToken(result.rows[0].username)}; Max-Age=2592000; Path=/; SameSite=None; httpOnly; Secure;`
        );
        res.status(201).json(result.rows[0]);
      } else {
        res.status(401).json({ error: 'Błędne hasło' });
      }
    } else {
      res.status(401).json({ error: 'Błędny login' });
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.post('/api/logout', async (req, res) => {
  try {
    res.setHeader(
      'Set-Cookie',
      `loggedIn=true; Max-Age=0; Path=/; SameSite=None; httpOnly; Secure;`
    );
    res.status(200).json({ message: 'Wylogowano pomyślnie!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


https.createServer(options, server).listen(port, () => {
  console.log(`Serwer działa na https://localhost:${port}`);
});
