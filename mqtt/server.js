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

const { Pool } = pkg;

const server = express();
const port = 8001;

const options = {
  key: fs.readFileSync('./certs/server.key'), 
  cert: fs.readFileSync('./certs/server.crt'),
};

const dataBaseURL = '192.168.0.13' // '10.231.25.216' domowy '192.168.0.13' // ? localhost nie dziala przez to ze db na razie jest na windowsie

server.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
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

// ! MQTT

const client = mqtt.connect('mqtt://localhost:1883');
client.on('connect', () => {
  console.log('Połączono z brokerem MQTT');
  client.subscribe('post', (err) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Subskrybowano post');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`${topic}: ${message.toString()}`);
});

https.createServer(options, server).listen(port, () => {
  console.log(`Serwer działa na https://localhost:${port}`);
});
