import express from 'express';
import pkg from 'pg';
import cors from 'cors';
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

server.post('/api/register-user', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    console.log('x')
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
