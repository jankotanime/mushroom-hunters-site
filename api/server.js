// ! TODO: Dodać bazę danych do projektu

import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import findingByLogin from './finding.js';

const { Pool } = pkg;

const server = express();
const port = 8000;

server.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // ? Na przyszłość do ciasteczek
}));

server.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
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
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, password]
      );
      res.status(201).json(result.rows[0]);
    } else if (freeUserName >= 0) {
      res.status(409).json({ error: 'nazwa zajeta' });
    } else {
      res.status(500).json({ error: error.freeUserName });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.post('/api/login-user', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username=$1',
      [username]
    );
    if (result.rows[0]) {
      if (result.rows[0].password === password) {
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

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
