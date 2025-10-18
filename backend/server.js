const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к базе данных
const sequelize = new Sequelize(
  process.env.DB_NAME || 'talent_platform',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

// Socket.io для чата в реальном времени
io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Пользователь ${socket.id} присоединился к комнате ${roomId}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

// Маршруты
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/communities', require('./src/routes/communities'));
app.use('/api/projects', require('./src/routes/projects'));
app.use('/api/events', require('./src/routes/events'));
app.use('/api/chat', require('./src/routes/chat'));

// Проверка здоровья
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Бэкенд платформы талантов работает',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log('✅ API готов к работе (база данных временно отключена)');
});
