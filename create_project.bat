@echo off
echo ========================================
echo СОЗДАНИЕ ПРОЕКТА TALENT PLATFORM
echo ========================================
echo.

echo Создаем структуру папок...
mkdir backend\src\controllers
mkdir backend\src\models
mkdir backend\src\routes
mkdir backend\src\middleware
mkdir backend\src\config
mkdir backend\src\utils
mkdir mobile\src\components
mkdir mobile\src\screens
mkdir mobile\src\navigation
mkdir mobile\src\store
mkdir mobile\src\services
mkdir mobile\src\assets
mkdir mobile\src\hooks

echo.
echo Создаем основные файлы Backend...

:: Backend Server
echo // Backend сервер для платформы талантов> backend\server.js
echo const express = require('express');>> backend\server.js
echo const cors = require('cors');>> backend\server.js
echo const { Sequelize } = require('sequelize');>> backend\server.js
echo const http = require('http');>> backend\server.js
echo const socketIo = require('socket.io');>> backend\server.js
echo require('dotenv').config();>> backend\server.js
echo.>> backend\server.js
echo const app = express();>> backend\server.js
echo const server = http.createServer(app);>> backend\server.js
echo const io = socketIo(server, {>> backend\server.js
echo   cors: {>> backend\server.js
echo     origin: "*",>> backend\server.js
echo     methods: ["GET", "POST"]>> backend\server.js
echo   }>> backend\server.js
echo });>> backend\server.js
echo.>> backend\server.js
echo // Middleware>> backend\server.js
echo app.use(cors());>> backend\server.js
echo app.use(express.json());>> backend\server.js
echo app.use(express.urlencoded({ extended: true }));>> backend\server.js
echo.>> backend\server.js
echo // Подключение к базе данных>> backend\server.js
echo const sequelize = new Sequelize(>> backend\server.js
echo   process.env.DB_NAME || 'talent_platform',>> backend\server.js
echo   process.env.DB_USER || 'postgres',>> backend\server.js
echo   process.env.DB_PASSWORD || 'password',>> backend\server.js
echo   {>> backend\server.js
echo     host: process.env.DB_HOST || 'localhost',>> backend\server.js
echo     dialect: 'postgres',>> backend\server.js
echo     logging: false>> backend\server.js
echo   }>> backend\server.js
echo );>> backend\server.js
echo.>> backend\server.js
echo // Socket.io для чата в реальном времени>> backend\server.js
echo io.on('connection', (socket) => {>> backend\server.js
echo   console.log('Пользователь подключился:', socket.id);>> backend\server.js
echo.>> backend\server.js
echo   socket.on('join_room', (roomId) => {>> backend\server.js
echo     socket.join(roomId);>> backend\server.js
echo     console.log(^`Пользователь ${socket.id} присоединился к комнате ${roomId}^`);>> backend\server.js
echo   });>> backend\server.js
echo.>> backend\server.js
echo   socket.on('send_message', (data) => {>> backend\server.js
echo     socket.to(data.roomId).emit('receive_message', data);>> backend\server.js
echo   });>> backend\server.js
echo.>> backend\server.js
echo   socket.on('disconnect', () => {>> backend\server.js
echo     console.log('Пользователь отключился:', socket.id);>> backend\server.js
echo   });>> backend\server.js
echo });>> backend\server.js
echo.>> backend\server.js
echo // Маршруты>> backend\server.js
echo app.use('/api/auth', require('./src/routes/auth'));>> backend\server.js
echo app.use('/api/users', require('./src/routes/users'));>> backend\server.js
echo app.use('/api/communities', require('./src/routes/communities'));>> backend\server.js
echo app.use('/api/projects', require('./src/routes/projects'));>> backend\server.js
echo app.use('/api/events', require('./src/routes/events'));>> backend\server.js
echo app.use('/api/chat', require('./src/routes/chat'));>> backend\server.js
echo.>> backend\server.js
echo // Проверка здоровья>> backend\server.js
echo app.get('/api/health', (req, res) => {>> backend\server.js
echo   res.json({ >> backend\server.js
echo     status: 'OK', >> backend\server.js
echo     message: 'Бэкенд платформы талантов работает',>> backend\server.js
echo     timestamp: new Date().toISOString()>> backend\server.js
echo   });>> backend\server.js
echo });>> backend\server.js
echo.>> backend\server.js
echo const PORT = process.env.PORT || 5000;>> backend\server.js
echo.>> backend\server.js
echo server.listen(PORT, async () => {>> backend\server.js
echo   console.log(^`🚀 Сервер запущен на порту ${PORT}^`);>> backend\server.js
echo.>> backend\server.js
echo   try {>> backend\server.js
echo     await sequelize.authenticate();>> backend\server.js
echo     console.log('✅ База данных подключена успешно');>> backend\server.js
echo.>> backend\server.js
echo     // Синхронизация базы данных>> backend\server.js
echo     await sequelize.sync({ force: false });>> backend\server.js
echo     console.log('✅ База данных синхронизирована');>> backend\server.js
echo   } catch (error) {>> backend\server.js
echo     console.error('❌ Ошибка подключения к базе данных:', error);>> backend\server.js
echo   }>> backend\server.js
echo });>> backend\server.js

:: Database config
echo const { Sequelize } = require('sequelize');> backend\src\config\database.js
echo require('dotenv').config();>> backend\src\config\database.js
echo.>> backend\src\config\database.js
echo const sequelize = new Sequelize(>> backend\src\config\database.js
echo   process.env.DB_NAME || 'talent_platform',>> backend\src\config\database.js
echo   process.env.DB_USER || 'postgres', >> backend\src\config\database.js
echo   process.env.DB_PASSWORD || 'password',>> backend\src\config\database.js
echo   {>> backend\src\config\database.js
echo     host: process.env.DB_HOST || 'localhost',>> backend\src\config\database.js
echo     dialect: 'postgres',>> backend\src\config\database.js
echo     logging: false,>> backend\src\config\database.js
echo     pool: {>> backend\src\config\database.js
echo       max: 5,>> backend\src\config\database.js
echo       min: 0,>> backend\src\config\database.js
echo       acquire: 30000,>> backend\src\config\database.js
echo       idle: 10000>> backend\src\config\database.js
echo     }>> backend\src\config\database.js
echo   }>> backend\src\config\database.js
echo );>> backend\src\config\database.js
echo.>> backend\src\config\database.js
echo module.exports = sequelize;>> backend\src\config\database.js

echo.
echo Создаем основные файлы Mobile...

:: Mobile App.js
echo import React from 'react';> mobile\App.js
echo import { StatusBar } from 'expo-status-bar';>> mobile\App.js
echo import { Provider } from 'react-redux';>> mobile\App.js
echo import { NavigationContainer } from '@react-navigation/native';>> mobile\App.js
echo import { createNativeStackNavigator } from '@react-navigation/native-stack';>> mobile\App.js
echo import { store } from './src/store/store';>> mobile\App.js
echo import MainTabNavigator from './src/navigation/MainTabNavigator';>> mobile\App.js
echo import AuthScreen from './src/screens/AuthScreen';>> mobile\App.js
echo import { useAuth } from './src/hooks/useAuth';>> mobile\App.js
echo.>> mobile\App.js
echo const Stack = createNativeStackNavigator();>> mobile\App.js
echo.>> mobile\App.js
echo export default function App() {>> mobile\App.js
echo   return (>> mobile\App.js
echo     ^<Provider store={store}^>>> mobile\App.js
echo       ^<NavigationContainer^>>> mobile\App.js
echo         ^<AppContent /^>>> mobile\App.js
echo       ^</NavigationContainer^>>> mobile\App.js
echo     ^</Provider^>>> mobile\App.js
echo   );>> mobile\App.js
echo }>> mobile\App.js
echo.>> mobile\App.js
echo function AppContent() {>> mobile\App.js
echo   const { user, isLoading } = useAuth();>> mobile\App.js
echo.>> mobile\App.js
echo   if (isLoading) {>> mobile\App.js
echo     return null; // Или экран загрузки>> mobile\App.js
echo   }>> mobile\App.js
echo.>> mobile\App.js
echo   return (>> mobile\App.js
echo     ^<^>>> mobile\App.js
echo       ^<StatusBar style="auto" /^>>> mobile\App.js
echo       ^<Stack.Navigator screenOptions={{ headerShown: false }}^>>> mobile\App.js
echo         {user ? (>> mobile\App.js
echo           ^<Stack.Screen name="Main" component={MainTabNavigator} /^>>> mobile\App.js
echo         ) : (>> mobile\App.js
echo           ^<Stack.Screen name="Auth" component={AuthScreen} /^>>> mobile\App.js
echo         )}>> mobile\App.js
echo       ^</Stack.Navigator^>>> mobile\App.js
echo     ^</^>>> mobile\App.js
echo   );>> mobile\App.js
echo }>> mobile\App.js

:: Store
echo import { configureStore } from '@reduxjs/toolkit';> mobile\src\store\store.js
echo import authSlice from './slices/authSlice';>> mobile\src\store\store.js
echo import communitiesSlice from './slices/communitiesSlice';>> mobile\src\store\store.js
echo import projectsSlice from './slices/projectsSlice';>> mobile\src\store\store.js
echo import eventsSlice from './slices/eventsSlice';>> mobile\src\store\store.js
echo.>> mobile\src\store\store.js
echo export const store = configureStore({>> mobile\src\store\store.js
echo   reducer: {>> mobile\src\store\store.js
echo     auth: authSlice,>> mobile\src\store\store.js
echo     communities: communitiesSlice,>> mobile\src\store\store.js
echo     projects: projectsSlice,>> mobile\src\store\store.js
echo     events: eventsSlice,>> mobile\src\store\store.js
echo   },>> mobile\src\store\store.js
echo   middleware: (getDefaultMiddleware) =>>> mobile\src\store\store.js
echo     getDefaultMiddleware({>> mobile\src\store\store.js
echo       serializableCheck: {>> mobile\src\store\store.js
echo         ignoredActions: ['persist/PERSIST'],>> mobile\src\store\store.js
echo       },>> mobile\src\store\store.js
echo     }),>> mobile\src\store\store.js
echo });>> mobile\src\store\store.js

echo.
echo Создаем README файл...

:: README.md
echo # Платформа Талантов> README.md
echo.>> README.md
echo Мобильное приложение для взаимодействия предприятий со студентами и инженерами.>> README.md
echo.>> README.md
echo ## 🚀 Быстрый старт>> README.md
echo.>> README.md
echo ### Backend>> README.md
echo \`\`\`bash>> README.md
echo cd backend>> README.md
echo npm install>> README.md
echo npm run dev>> README.md
echo \`\`\`>> README.md
echo.>> README.md
echo ### Mobile App>> README.md
echo \`\`\`bash>> README.md
echo cd mobile>> README.md
echo npm install>> README.md
echo npm start>> README.md
echo \`\`\`>> README.md
echo.>> README.md
echo ## 📁 Структура проекта>> README.md
echo \`\`\`>> README.md
echo talent-platform/>> README.md
echo ├── backend/     # Node.js API сервер>> README.md
echo └── mobile/      # React Native приложение>> README.md
echo \`\`\`>> README.md

echo.
echo ========================================
echo ПРОЕКТ УСПЕШНО СОЗДАН!
echo ========================================
echo.
echo Дальнейшие действия:
echo 1. Запусти backend: cd backend && npm install && npm run dev
echo 2. Запусти mobile: cd mobile && npm install && npm start
echo.
pause