import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

io.on('connection', (socket) => {
  socket.on('create room', (roomId) => {

  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log(msg)
  });
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});
app.get('/home', (req, res) => {
  res.sendFile(join(__dirname, '../public/home.html'));
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});